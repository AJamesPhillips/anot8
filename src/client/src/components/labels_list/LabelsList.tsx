import { h } from "preact"

import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"
import { LabelsListContainer } from "./LabelsListContainer"



const map_state = (state: State) => ({})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)



function _LabelsList (props: Props)
{
    return <div>
        <h3>List of labels:</h3>
        <input id="labels_search" type="text" placeholder="Search labels..." />
        <input id="labels_search_clear" type="button" value="x" />
        Highlight used labels: <input id="labels_used_toggle" type="checkbox" />
        <LabelsListContainer />
    </div>
}

export const LabelsList = connector(_LabelsList)
