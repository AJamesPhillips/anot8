import { h } from "preact"

import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"
import { LabelComponent } from "./Label"



const map_state = (state: State) => ({
    label_ids_list_to_display: state.labels.label_ids_list_to_display,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)



function _LabelsList (props: Props)
{
    return <div id="labels_list_container">
        {props.label_ids_list_to_display.map(label_id => <LabelComponent key={label_id} label_id={label_id} />)}
    </div>
}

export const LabelsList = connector(_LabelsList)
