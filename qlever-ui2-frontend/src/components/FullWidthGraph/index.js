import React from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import classNames from 'classnames'
import dagreD3 from 'dagre-d3'

import styles from './styles.module.scss'

class FullWidthGraphView extends React.Component {
    static propTypes = {
        graph: PropTypes.object.isRequired,
        maxZoom: PropTypes.number,
        isDiff: PropTypes.bool,
        className: PropTypes.string,
        innerRef: PropTypes.object,
        style: PropTypes.object
    }

    constructor() {
        super()
        // this.svgRef = React.createRef()
    }

    get ref() {
        return this.props.innerRef ? this.props.innerRef.current : this.svgRef
    }

    centerAndScaleIfNecessary = graph => {
        /*
        const initialZoom = this.props.maxZoom || 1.0

        // determine scale
        const svgWidth = this.d3svg.node().getBoundingClientRect().width
        const perfectZoomScale = svgWidth / graph.width
        const zoomScale = perfectZoomScale < initialZoom ? perfectZoomScale : initialZoom

        // center and scale
        const centerOffsetX = ((svgWidth - graph.width * zoomScale) / 2)
        this.d3svg.call(this.d3zoom.transform, d3.zoomIdentity.translate(centerOffsetX || 0, 20).scale(zoomScale))
        this.d3svg.attr('height', (graph.height * zoomScale || 0) + 40)
        */

        const paddingX = 10
        const paddingY = 10

        const width = Math.round((graph.width || 0) + 2 * paddingX)
        const height = Math.round((graph.height || 0) + 2 * paddingY)

        this.d3svg.attr('width', width)
        this.d3svg.attr('viewBox', `0 0 ${width} ${height}`)

        this.d3svg.call(
            this.d3zoom.transform,
            d3.zoomIdentity.translate(paddingX, paddingY)
        )
    }

    /*componentWillUnmount() {
        window.removeEventListener("resize", this.centerAndScaleIfNecessary)
    }*/

    componentDidMount() {
        // setup renderer
        this.d3render = new dagreD3.render()

        // Set up an SVG group so that we can translate the final graph.
        this.d3svg = d3.select(this.ref)
        this.d3svgInner = this.d3svg.select('g')

        // Set up zoom support
        this.d3zoom = d3
            .zoom()
            .on('zoom', () =>
                this.d3svgInner.attr('transform', d3.event.transform)
            )

        // window.addEventListener("resize", this.centerAndScaleIfNecessary)
        this.renderAndCenterD3()
    }

    componentDidUpdate() {
        console.log('FullWidthGraphView: componentDidUpdate')
        this.renderAndCenterD3()
    }

    renderAndCenterD3() {
        console.log('FullWidthGraphView: renderAndCenterD3')
        this.d3svgInner.selectAll('*').remove()

        const graph = this.props.graph
        if (!graph) return

        if (graph.nodes().length > 0) {
            this.d3render(this.d3svgInner, graph)
        }
        this.centerAndScaleIfNecessary(graph.graph())
    }

    setRef = ref => {
        this.svgRef = ref
    }

    render() {
        console.log('FullWidthGraphView: render')
        const { style, isDiff, className } = this.props

        return (
            <svg
                style={style}
                className={classNames(
                    className,
                    styles.svg,
                    isDiff && styles.isDiff
                )}
                preserveAspectRatio="none"
                ref={this.props.innerRef || this.setRef}
            >
                <g />
            </svg>
        )
    }
}

export default FullWidthGraphView
