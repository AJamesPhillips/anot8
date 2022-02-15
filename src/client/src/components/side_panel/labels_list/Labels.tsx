import { h } from "preact"

import { ACTIONS } from "../../../state/actions"
import { State } from "../../../state/state"
import { get_store } from "../../../state/store"
import { connect } from "../../../utils/preact-redux-simple/connect"
import { LabelsList } from "./LabelsList"



const map_state = (state: State) => ({
    have_any_labels: Object.keys(state.labels.labels_by_id).length > 0,
    highlighting_used_labels: state.labels.highlighting_used_labels,
    search_string: state.labels.search_string,
    running_locally: state.running_locally,
    is_from_url: !!state.routing.url,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)

const store = get_store()


function _Labels (props: Props)
{
    if (!props.have_any_labels)
    {
        const title = props.is_from_url
            ? "A vault of PDFs also specifies the labels so when a PDF is loaded by a URL there is no vault and no labels"
            : (props.running_locally
                ? "Add labels to your vault config json file"
                : "Editing a vault is not yet supported on anot8.org, must manually edit vault locally."
            )

        return <div style={{ color: "grey", fontSize: "small", cursor: "default" }} title={title}>
            No vault labels
        </div>
    }

    return <div className={props.highlighting_used_labels ? "highlight_used_labels" : ""}>
        <h3>List of labels:</h3>
        <input
            id="labels_search"
            type="text"
            placeholder="Search labels..."
            value={props.search_string}
            onKeyUp={e => store.dispatch(ACTIONS.labels.set_search_string({ search: e.currentTarget.value }))}
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
