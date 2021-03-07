import { h } from "preact"

import { get_annotation_by_compound_id } from "../../state/annotations/getters"
import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"



interface OwnProps
{
    compound_annotation_id: string
}

const map_state = (state: State, own_props: OwnProps) => ({
    annotation: get_annotation_by_compound_id(state, own_props.compound_annotation_id)
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)


function _AnnotationOnPDF (props: Props)
{
    const { annotation } = props

    if (!annotation)
    {
        console.error(`Could not find annotation for compound_id: "${props.compound_annotation_id}"`)
        return null
    }

    const { compound_id } = annotation
    const class_name = `annotation annotation_${compound_id}`

    const { text, comment, left, top, width, height, colour: backgroundColor } = annotation

    const title = text + " " + comment
    const style: h.JSX.CSSProperties = { left, top, width, height, backgroundColor }

    return <div className={class_name} style={style} title={title}></div>
}

export const AnnotationOnPDF = connector(_AnnotationOnPDF)



interface CreateEmptyAnnotationElArgs
{
    annotations_container_el: HTMLElement
}
export function create_empty_annotation_el ({ annotations_container_el }: CreateEmptyAnnotationElArgs)
{
    const annotation_el = document.createElement("div")
    annotation_el.className = "annotation"
    annotations_container_el.appendChild(annotation_el)

    return annotation_el
}
