import { h } from "preact"

import { State } from "../../../state/state"
import { connect } from "../../../utils/preact-redux-simple/connect"
import { AnnotationListEntry } from "./AnnotationListEntry"



interface OwnProps {}


const map_state = (state: State) => ({
    annotations: state.annotations.all_annotations
})
const connector = connect(map_state)
type Props = ReturnType<typeof map_state> & OwnProps


function _AnnotationsList (props: Props)
{
    return <div>
        {props.annotations.map(a => <AnnotationListEntry key={a.compound_id} annotation={a} />)}
    </div>
}

export const AnnotationsList = connector(_AnnotationsList)
