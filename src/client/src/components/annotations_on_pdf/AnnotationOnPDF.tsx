import { h } from "preact"

import { get_annotation_by_compound_id } from "../../state/annotations/getters"
import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"



interface OwnProps
{
    editing_dimensions: boolean
    compound_annotation_id: string
}

const map_state = (state: State, own_props: OwnProps) => ({
    annotation: get_annotation_by_compound_id(state, own_props.compound_annotation_id)
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)


function _AnnotationOnPDF (props: Props)
{
    const { annotation, editing_dimensions } = props

    if (!annotation)
    {
        console.error(`Could not find annotation for compound_id: "${props.compound_annotation_id}"`)
        return null
    }

    const { compound_id } = annotation
    const class_name = `annotation annotation_${compound_id} ` + (editing_dimensions ? " editing_dimensions " : "")

    const { text, comment, left, top, width, height, colour: backgroundColor } = annotation

    const title = text + " " + comment
    const style: h.JSX.CSSProperties = { left, top, width, height, backgroundColor }

    return <div className={class_name} style={style} title={title}></div>
}

export const AnnotationOnPDF = connector(_AnnotationOnPDF)
