import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/sparql/sparql'
import 'codemirror/mode/diff/diff'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neat.css'

import styles from './styles.module.scss'

const SyntaxHighlightingSparqlEditor = ({
    editing,
    sparql,
    className,
    onChange,
    onKeyDown
}) => {
    const [focused, setFocused] = useState(false)
    const callbackRef = useRef(null)
    callbackRef.current = onKeyDown

    return (
        <div
            className={classNames(
                className,
                styles.newSparqlEditor,
                !editing && styles.disabled,
                focused && styles.focused
            )}
        >
            <CodeMirror
                value={sparql}
                className={styles.codeMirror}
                options={{
                    mode: 'sparql',
                    theme: 'neat',
                    lineNumbers: false,
                    lineWrapping: false,
                    viewportMargin: Infinity,
                    scrollbarStyle: null,
                    readOnly: !editing
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onBeforeChange={(editor, data, value) => onChange(value)}
                onKeyDown={(editor, event) =>
                    callbackRef.current && callbackRef.current(event)
                }
            />

            <div className="mdc-notched-outline mdc-notched-outline--upgraded mdc-notched-outline--notched">
                <div className="mdc-notched-outline__leading"></div>
                <div className="mdc-notched-outline__notch">
                    <label className="mdc-floating-label mdc-floating-label--float-above">
                        SPARQL Query
                    </label>
                </div>
                <div className="mdc-notched-outline__trailing"></div>
            </div>
        </div>
    )
}

SyntaxHighlightingSparqlEditor.propTypes = {
    className: PropTypes.string,
    editing: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    sparql: PropTypes.string.isRequired
}

export default SyntaxHighlightingSparqlEditor
