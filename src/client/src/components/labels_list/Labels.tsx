import { h } from "preact"

import { ACTIONS } from "../../state/actions"
import { State } from "../../state/state"
import { get_store } from "../../state/store"
import { connect } from "../../utils/preact-redux-simple/connect"
import { LabelsList } from "./LabelsList"



const map_state = (state: State) => ({
    highlighting_used_labels: state.labels.highlighting_used_labels,
    search_string: state.labels.search_string,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)

const store = get_store()


function _Labels (props: Props)
{
    return <div className={props.highlighting_used_labels ? "highlight_used_labels" : ""}>
        <h3>List of labels:</h3>
        <input
            id="labels_search"
            type="text"
            placeholder="Search labels..."
            value={props.search_string}
            onKeyPress={e => store.dispatch(ACTIONS.labels.set_search_string({ search: e.currentTarget.value }))}
        />

        &nbsp; Highlight used labels: <input
            id="labels_used_toggle"
            type="checkbox"
            checked={props.highlighting_used_labels}
            onChange={e => store.dispatch(ACTIONS.labels.set_highlighting_used_labels({ highlighting: e.currentTarget.checked }))}
        />
        <LabelsList />
    </div>
}

export const Labels = connector(_Labels)
