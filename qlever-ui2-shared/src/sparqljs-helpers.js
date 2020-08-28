import type { SparqlJsResult } from './sparqljs'
import { DataFactory } from 'n3'
import { cloneQuery } from './sparqljs'
import { walkObject } from './object-walk'
import { generateTriple } from './sparqljs-constructors'

type NodeType =
    | 'variable'
    | 'wikidata-entity'
    | 'wikidata-property-direct'
    | 'wikidata-property-direct'
    | 'wikidata-property-statement'
    | 'wikidata-property-qualifier'
    | 'other'

// traverse triples, call handleEntry on every triple entry
export function traverseTriples(query: SparqlJsResult, handleEntry: string => void) {
    const triples = getTriples(query)
    if (!triples) return false

    for (const triple of triples) {
        handleEntry(triple.subject)
        handleEntry(triple.predicate)
        handleEntry(triple.object)
    }

    return true
}

// determine node type
export function computeNodeType(node): NodeType {
    const value = node.value

    if (node.termType === 'Variable') return 'variable'
    if (value.startsWith('?')) return 'variable'
    if (value.startsWith('http://www.wikidata.org/entity/')) return 'wikidata-entity'
    if (value.startsWith('http://www.wikidata.org/prop/direct')) return 'wikidata-property-direct'
    if (value.startsWith('http://www.wikidata.org/prop/statement/'))
        return 'wikidata-property-statement'
    if (value.startsWith('http://www.wikidata.org/prop/qualifier'))
        return 'wikidata-property-qualifier'
    if (value.startsWith('http://www.wikidata.org/prop/')) return 'wikidata-property'

    // throw `Cannot parse value "${value}" into node type`
    return 'other'
}

// get triples from query. optionally create it.
export function getTriples(query: SparqlJsResult, create = false) {
    let bgpWhereCondition = query.where.find(e => e.type === 'bgp')
    if (!bgpWhereCondition || !bgpWhereCondition.triples) {
        if (!create) return null
        if (!bgpWhereCondition) {
            bgpWhereCondition = {
                type: 'bgp',
                triples: []
            }
            query.where.push(bgpWhereCondition)
        } else if (!bgpWhereCondition.triples) {
            bgpWhereCondition.triples = []
        }
    }

    return bgpWhereCondition.triples
}

// ---------------------------- VARIABLES -------------------------------------------------

// get all variables used in query
export function getVariablesFromSparqlJS(query: SparqlJsResult): Array<string> {
    const variables = new Set()

    function handleEntry(entry) {
        const entryType = computeNodeType(entry)
        if (entryType !== 'variable') return
        variables.add(entry.value)
    }

    traverseTriples(query, handleEntry)

    return Array.from(variables)
}

// get all variables used in query, and the information whether they are
// selected and the corresponding label variable
export function getVariablesWithSelectStateAndLabels(query: SparqlJsResult) {
    const variables = getVariablesWithCorrespondingLabelsFromSparqlJS(query)

    const selectedVariabes = query.variables.map(x => x.value)

    return Array.from(variables.entries(), ([variable, labels]) => {
        const labelToUse = labels.length && labels[0]
        return {
            variable,
            selected: selectedVariabes.includes(variable),
            labelSelected: labelToUse ? selectedVariabes.includes(labelToUse) : false,
            labelName: labelToUse ? labelToUse : undefined
        }
    })
}

// get all variables used in query and the corresponding label variable, if it exists
export function getVariablesWithCorrespondingLabelsFromSparqlJS(query: SparqlJsResult) {
    // game plan: get all variables, recognize which are labels and which are not (done)
    // then see which are selected and which are not.
    // then convert to output to a data structure we can consume later on

    const triples = getTriples(query) || []
    const variables = new Map()

    const handleEntry = node => {
        // const nodeType = computeNodeType(node)
        // if (nodeType !== "variable") return
        if (node.termType !== 'Variable') return

        if (variables.has(node.value)) return
        variables.set(node.value, [])
    }

    for (const triple of triples) {
        handleEntry(triple.subject)
        handleEntry(triple.predicate)
        if (triple.predicate.value !== 'http://www.w3.org/2000/01/rdf-schema#label') {
            handleEntry(triple.object)
        } else {
            if (triple.object.termType !== 'Variable') continue
            const labelsForNode = variables.get(triple.subject.value)
            labelsForNode.push(triple.object.value)
        }
    }

    return variables
}

// find the lanaguage (en) filter for a variable
function findLanguageFilterForVariable(query, variable) {
    if (!query.where) return -1
    return query.where.findIndex(
        e =>
            e.type === 'filter' &&
            ['langmatches', '='].includes(e.expression.operator) &&
            e.expression.args &&
            e.expression.args.length &&
            e.expression.args[0] &&
            e.expression.args[0].operator === 'lang' &&
            e.expression.args[0].args.length === 1 &&
            e.expression.args[0].args[0] &&
            e.expression.args[0].args[0].value === variable
    )
}

// adds a language filter to a variable, if it doesnt exist yet
function addLanguageFilterIfNotExist(query, variable) {
    const langFilterIndex = findLanguageFilterForVariable(query, variable)
    console.log('addLanguageFilterIfNotExist', langFilterIndex, variable)
    if (langFilterIndex === -1) {
        // add lang filter
        const langFilter = {
            type: 'filter',
            expression: {
                type: 'operation',
                operator: '=',
                args: [
                    {
                        type: 'operation',
                        operator: 'lang',
                        args: [DataFactory.variable(variable)]
                    },
                    DataFactory.literal('en')
                ]
            }
        }
        if (!query.where) query.where = []
        query.where.push(langFilter)
    }
}

// rename a variable
export function renameVariable(query: SparqlJsResult, oldName: string, newName: string) {
    const clonedQuery = cloneQuery(query)

    // todo: find variable and rename it
    // this is a particular sucker as variables can be everywhere. maybe just be hacky and replace in serialized output =)
    walkObject(clonedQuery, (object, key) => {
        const value = object[key]
        if (value === oldName) {
            object[key] = newName
        } else if (value === `${oldName}Label`) {
            object[key] = `${newName}Label`
        }
    })
    return clonedQuery
}

export function addLabelForVariable(query, variable, labelName = `${variable}Label`) {
    const selectedVariabes = query.variables.map(x => x.value)

    // add rdfs:label triple
    const triples = getTriples(query)
    triples.push({
        subject: DataFactory.variable(variable),
        predicate: DataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        object: DataFactory.variable(labelName)
    })

    addLanguageFilterIfNotExist(query, labelName)

    // add variable to selection
    if (!selectedVariabes.includes(labelName)) {
        query.variables.push(DataFactory.variable(labelName))
    }

    // add prefix
    if (!query.prefixes['rdfs']) {
        query.prefixes['rdfs'] = 'http://www.w3.org/2000/01/rdf-schema#'
    }
}

// change whether a variable (that might be a label for another variable) is selected or not
export function setVariableSelectState(
    query: SparqlJsResult,
    variable: string,
    state: boolean,
    isLabelFor: string
) {
    // possibilities
    // 1: variable is not known
    //    a) is label for known variable => add rdfs:label triple (maybe lang filter too), add variable to select
    //    b) is label for unknown variable => ignore, warn message
    // 2: variable is known => just add or remove from select,
    //     if it's a label and state == false, also remove the rdfs:label triple

    const clonedQuery = cloneQuery(query)
    const selectedVariabes = clonedQuery.variables.map(x => x.value)

    const variables = getVariablesFromSparqlJS(query)

    if (!variables.includes(variable)) {
        if (isLabelFor && variables.includes(isLabelFor)) {
            // add rdfs:label triple
            addLabelForVariable(clonedQuery, isLabelFor, variable)
        } else {
            console.warn(
                `tried to add unknown variable ${variable}, isLabelFor ${isLabelFor} is also not known`
            )
            return
        }
    } else {
        // case 2
        if (state) {
            // add to select
            if (selectedVariabes.includes(variable)) return
            clonedQuery.variables.push(DataFactory.variable(variable))

            if (isLabelFor) {
                addLanguageFilterIfNotExist(clonedQuery, variable)
            }
        } else {
            // remove from select
            const index = selectedVariabes.findIndex(e => e === variable)
            if (index === -1) return
            clonedQuery.variables.splice(index, 1)

            if (isLabelFor) {
                // remove rdfs:label triple
                const triples = getTriples(clonedQuery)
                const tripleIndex = triples.findIndex(
                    e =>
                        e.predicate.value === 'http://www.w3.org/2000/01/rdf-schema#label' &&
                        e.object.value === variable &&
                        e.subject.value === isLabelFor
                )
                if (tripleIndex !== -1) {
                    triples.splice(tripleIndex, 1)
                } else {
                    console.warn(
                        `removed label ${variable} (is for ${isLabelFor}) but there was no rdfs:label triple between these two`
                    )
                }

                // remove langFilter
                const langFilterIndex = findLanguageFilterForVariable(clonedQuery, variable)
                if (langFilterIndex !== -1) {
                    clonedQuery.where.splice(langFilterIndex, 1)
                }
            }
        }
    }

    return clonedQuery
}

// ----------------------------------------------------------------------------

// remove all labels from query
export function removeLabelsFromQuery(query: SparqlJsResult) {
    // remove label
    const triples = getTriples(query) || []
    for (let i = triples.length - 1; i >= 0; i--) {
        const triple = triples[i]
        if (triple.predicate.value === 'http://www.w3.org/2000/01/rdf-schema#label') {
            if (triple.object.termType === 'Variable') {
                // we need to remove this variable too
                const index = query.variables.findIndex(x => x.value === triple.object.value)
                if (index) {
                    query.variables.splice(index, 1)
                }
            }
            triples.splice(i, 1)
        }
    }

    // remove langmatches or lang filters
    for (let i = query.where.length - 1; i >= 0; i--) {
        const element = query.where[i]
        if (
            element.type === 'filter' &&
            ['langmatches', '='].includes(element.expression.operator) &&
            element.expression.args &&
            element.expression.args.length &&
            element.expression.args[0] &&
            element.expression.args[0].operator === 'lang'
        ) {
            query.where.splice(i, 1)
        }
    }
}

// replace prefixes with their full url
export function applyPrefixes(prefixes: { [string]: string }, uri: string) {
    // make sure we apply the bigger prefixes first
    const prefixList = Object.entries(prefixes)

    // eslint-disable-next-line no-unused-vars
    const sortedPrefixes = prefixList.sort(([_a, a], [_b, b]) => {
        if (a.startsWith(b)) return -1
        if (b.startsWith(a)) return 1
        return 0
    })

    for (const [prefix, prefixUri] of sortedPrefixes) {
        uri = uri.replace(((prefixUri: any): string), `${prefix}:`)
    }
    return uri
}

// get all wikidata identifiers that are used in query
export function getWikidataIdentifiersFromSparqlJS(query: SparqlJsResult): Array<string> {
    const identifiers = new Set()

    function handleEntry(entry) {
        const entryType = computeNodeType(entry)
        const entryWithPrefix = applyPrefixes(query.prefixes, entry.value)
        const identifier = getWikipediaIdentifier(entryType, entryWithPrefix)

        if (identifier) {
            identifiers.add(identifier.identifier)
        }
    }

    traverseTriples(query, handleEntry)

    return Array.from(identifiers)
}

// get wikidata identifiers from a node value and the node type
export function getWikipediaIdentifier(nodeType: NodeType, valueWithAppliedPrefixes) {
    if (
        !(
            nodeType === 'wikidata-entity' ||
            nodeType === 'wikidata-property' ||
            nodeType === 'wikidata-property-qualifier' ||
            nodeType === 'wikidata-property-direct' ||
            nodeType === 'wikidata-property-statement'
        )
    ) {
        return null
    }

    const [prefix, identifier_] = valueWithAppliedPrefixes.split(':')
    const identifier = identifier_.replace('qualifier/', '').replace('direct/', '')

    return { prefix, identifier }
}

// replace triple with two triples that form a statement node
export function replaceTripleWithStatementNode(index, triples, variableName = `?test_statement`) {
    // remove old
    const triple = triples[index]
    triples.splice(index, 1)

    // generate new triples
    const identifier = triple.predicate.value.replace('http://www.wikidata.org/prop/direct/', '')
    const statementTriple1 = generateTriple(
        triple.subject,
        DataFactory.namedNode(`http://www.wikidata.org/prop/${identifier}`),
        DataFactory.variable(variableName)
    )
    const statementTriple2 = generateTriple(
        DataFactory.variable(variableName),
        DataFactory.namedNode(`http://www.wikidata.org/prop/statement/${identifier}`),
        triple.object
    )
    triples.push(statementTriple1, statementTriple2)
}

// get variables that represent a statement
export function getStatementVariables(query: SparqlJsResult): Array<string> {
    const statements = new Set()

    const triples = getTriples(query, true)
    for (const triple of triples) {
        const type = computeNodeType(triple.predicate)
        const objectIsStatement = type === 'wikidata-property'
        const subjectIsStatement = [
            'wikidata-property-qualifier',
            'wikidata-property-statement'
        ].includes(type)

        if (objectIsStatement) statements.add(triple.object.value)
        if (subjectIsStatement) statements.add(triple.subject.value)
    }

    return Array.from(statements)
}
