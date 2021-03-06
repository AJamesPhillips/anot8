import { h } from "preact"
import { Annotation } from "../../state/interfaces"



interface OwnProps
{
    editing_dimensions: boolean
    annotation: Annotation
}
export function Annotation (props: OwnProps)
{
    const { annotation, editing_dimensions } = props
    const { id } = annotation
    const class_name = `annotation annotation_${id}` + (editing_dimensions ? " editing_dimensions" : "")

    return <div className={class_name}></div>
}
