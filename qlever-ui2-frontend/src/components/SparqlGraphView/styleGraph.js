import { Graph } from 'graphlib'

const hasOwnProperty = Object.prototype.hasOwnProperty

// styles for different type of nodes/edges.
const NODE_OR_EDGE_TYPE_BASED_STYLES = {
    'wikidata-entity': 'fill: lightblue',
    'wikidata-statement': 'fill: lightyellow',
    'wikidata-property': 'fill: blue',
    variable: 'fill: green',
    label: 'fill: lightgreen',
    other: 'fill: red',
    newNode: 'fill: yellowgreen; opacity: 1;',
    newNodeLabel: 'opacity: 1;',
    'wikidata-property-qualifier': 'fill: none; stroke: Yrgba(0,0,255, 0.5)',
    newEdge: 'fill: none; stroke: yellowgreen; opacity: 1;',
    newEdgeLabel: 'fill: green; opacity: 1;'
}

// clones a graph
export function cloneGraph(graph: Graph): Graph {
    const newGraph = JSON.parse(JSON.stringify(graph))

    // copy static properties
    newGraph.__proto__ = graph.__proto__ // functions
    newGraph.__proto__._nodeCount = graph.__proto__._nodeCount
    newGraph.__proto__._edgeCount = graph.__proto__._edgeCount
    newGraph._defaultEdgeLabelFn = graph._defaultEdgeLabelFn
    newGraph._defaultNodeLabelFn = graph._defaultNodeLabelFn

    return newGraph
}

// colors the graph in a way that it represents the diff between graph and oldGraph
export function colorDiff(graph: Graph, oldGraph: Graph) {
    /* implementation ideas
     possible changes are currently:
     - a new node with a new edge
     - two new nodes with two new edges (qualifiers)
     - a relation becomes a statement -> one new node, an edge goes missing, two new edges

     information:
     - variables names are unique. a variable node is the same node in the new graph, if it has the same name
     - constant nodes are unique too.
     - edges are always between two nodes, which are unique


     how can we detect these?
     - nodes: just check if a node with the same name exists in the old graph. if not -> new
     - edges: just check if the edge (connecting two unique nodes) exists in the old graph. if not -> new
     */

    const oldNodes = oldGraph.nodes()
    const oldEdges = oldGraph.edges()

    const traverseNodeFunction = (data, node) => {
        const existsInOldGraph = !!oldNodes.find(x => x === node)
        if (existsInOldGraph) return

        data.style = NODE_OR_EDGE_TYPE_BASED_STYLES['newNode']
        data.labelStyle += ';' + NODE_OR_EDGE_TYPE_BASED_STYLES['newNodeLabel']
    }

    const traverseEdgeFunction = (data, edge) => {
        const existsInOldGraph = !!oldEdges.find(
            x => x.v === edge.v && x.w === edge.w && x.name === edge.name
        )
        if (existsInOldGraph) return

        data.style = NODE_OR_EDGE_TYPE_BASED_STYLES['newEdge']
        data.labelStyle += ';' + NODE_OR_EDGE_TYPE_BASED_STYLES['newEdgeLabel']
    }

    traveseNodes(graph, traverseNodeFunction)
    traveseEdges(graph, traverseEdgeFunction)
}

// adds labels to the graph, based on the identifier mapping
export function addLabelsToGraph(
    graph: Graph,
    identifierMapping: { [key: string]: string }
) {
    console.log('QueryView: extending graph with labels')

    const resolved = {}
    traveseNodesAndEdges(graph, data =>
        applyLabelToEdgeOrNode(data, identifierMapping, resolved)
    )

    return graph
}

// adds label to entry (which is an edge or node), based on the identifier mapping
function applyLabelToEdgeOrNode(entry, mapping: { [key: string]: string }) {
    if (!entry.wikipediaIdentifier) return

    const resolved = hasOwnProperty.call(mapping, entry.wikipediaIdentifier)
    if (!resolved) return
    const mappedName = mapping[entry.wikipediaIdentifier]
    if (mappedName) {
        const isEntity = entry.wikipediaIdentifier.startsWith('Q')
        const labelPart = isEntity ? `[${mappedName}]` : `<${mappedName}>`
        entry.label = `${entry.wikipediaPrefix}:${labelPart}`
    } else {
        entry.label = `${entry.label}\n(invalid wikidata identifier)`
        entry.invalidWikidataIdentifier = true
    }
}

// applies the styles to the graph
export function applyStyleToGraph(graph: Graph) {
    console.log('QueryView: applying styles')
    traveseNodes(graph, applyStyleToNode)
    traveseEdges(graph, applyStyleToEdges)
}

// apply the styles to a node
function applyStyleToNode(data) {
    if (data.invalidWikidataIdentifier) {
        data.style = 'fill: red'
        data.labelStyle = 'font-weight: bold'
        return
    }

    const selectKey = data.isStatement ? 'wikidata-statement' : data.type
    if (data.isStatement) {
        data.rx = 15
        data.ry = 15
    }

    data.style = NODE_OR_EDGE_TYPE_BASED_STYLES[selectKey]
}

// apply the styles to an edge
function applyStyleToEdges(data) {
    if (data.invalidWikidataIdentifier) {
        data.labelStyle = 'font-weight: bold; fill: red'
    }
    if (data.type === 'wikidata-property-qualifier') {
        data.style = NODE_OR_EDGE_TYPE_BASED_STYLES[data.type]
    }
}

// _____________________________________________________________________________________________________________________
// tree traversal helpers

// traverses all nodes, calls func on each node
function traveseNodes(graph: Graph, func: (data: any, node: any) => void) {
    const nodes = graph.nodes()
    const nodesData = nodes.map(x => [graph.node(x), x])

    nodesData.forEach(([data, node]) => func(data, node))
}

// traverses all edges, calls func on each edge
function traveseEdges(graph: Graph, func: (data: any, edge: any) => void) {
    // now add labels to graph
    const edges = graph.edges()
    const edgesData = edges.map(x => [graph.edge(x), x])

    edgesData.forEach(([data, edge]) => func(data, edge))
}

// traverses all nodes and edges, calls func on each edge or node
function traveseNodesAndEdges(graph: Graph, func: (data: any) => void) {
    // now add labels to graph
    traveseNodes(graph, func)
    traveseEdges(graph, func)
}
