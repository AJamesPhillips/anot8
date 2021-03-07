import { h } from "preact"

import { ACTIONS } from "../../state/actions"
import { Annotation } from "../../state/interfaces"
import { dispatch } from "../../state/store"



interface OwnProps {
    annotation: Annotation
}


export function AnnotationListEntry (props: OwnProps)
{
    const { compound_id, colour, dirty, text, comment, labels, page_number, user_name } = props.annotation

    const className = `annotation_list_element annotation_${compound_id}`
    const on_click = () => {
        dispatch(ACTIONS.selected_annotations.toggle_annotation_highlight({ compound_id }))
    }

    return <div
        style={{ backgroundColor: colour }}
        className={className}
        onClick={on_click}
    >
        {dirty && <span style={{ backgroundColor: "yellow" }}>⚠</span>}
        {text}
        <br /><br />
        <div style={{ float: "left" }}>
            <span style={{ color: "#777", fontSize: 10 }}>Comment: {comment}</span>
        </div>
        <br />
        <div style={{ float: "left", display: "flex" }}>
            <span style={{ color: "#777", fontSize: 10 }}>Labels: </span>
            {labels.map(l => <div className="label">{l}</div>)}
        </div>
        <div style={{ float: "right", color: "#777", fontSize: 10 }}>page: {page_number}</div><br />
        {user_name && <div style={{ float: "right", color: "#777", fontSize: 10 }}>by: {user_name}</div>}
        <div style={{ clear: "both" }}></div>
    </div>
}
