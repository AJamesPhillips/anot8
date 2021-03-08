import { h } from "preact"

import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"



const map_state = (state: State) => ({
    // resolved: state.loading_pdf.status === "resolved",
    // downloaded: state.loading_pdf.status === "downloaded",
    labels: state.loading_pdf.labels,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)



function _LabelsListContainer (props: Props)
{
    return <div id="labels_list_container">
        {props.labels.map(label => <div>{label}</div>)}
    </div>
}

export const LabelsListContainer = connector(_LabelsListContainer)
