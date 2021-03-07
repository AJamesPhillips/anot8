import { h } from "preact"

import { ACTIONS } from "../../state/actions"
import { Annotation } from "../../state/interfaces"
import { State } from "../../state/state"
import { dispatch } from "../../state/store"
import { connect } from "../../utils/preact-redux-simple/connect"



interface OwnProps {
    annotation: Annotation
}


const map_state = (state: State, own_props: OwnProps) => ({ a: 1 })
const connector = connect(map_state)
type Props = ReturnType<typeof map_state> & OwnProps


function _AnnotationListEntry (props: Props)
{
    const { compound_id, colour, dirty, text, comment, labels, page_number } = props.annotation

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
        <div style={{ float: "right", color: "#777", fontSize: 10 }}>page: {page_number}</div>
        <div style={{ clear: "both" }}></div>
    </div>
}

export const AnnotationListEntry = connector(_AnnotationListEntry)
