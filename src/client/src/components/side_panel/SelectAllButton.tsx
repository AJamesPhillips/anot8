import { h } from "preact"
import { ACTIONS } from "../../state/actions"
import { get_all_annotation_ids_owned_by_user } from "../../state/annotations/getters"

import { State } from "../../state/state"
import { get_store } from "../../state/store"
import { connect } from "../../utils/preact-redux-simple/connect"



interface OwnProps {}


const map_state = (state: State) => ({
    all_annotation_ids_owned_by_user: get_all_annotation_ids_owned_by_user(state),
    selected_compound_ids: state.selected_annotations.selected_compound_ids,
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)



function _SelectAllButton (props: Props)
{
    const selected_compound_ids_set = new Set(props.selected_compound_ids)
    const missing_annotation = props.all_annotation_ids_owned_by_user.find(id => !selected_compound_ids_set.has(id))

    const disabled = !missing_annotation
    const fill = disabled ? "#aaa" : "#000"


    return <div>
        <button
            disabled={disabled}
            title="Select all of your annotations"
            onClick={() =>
            {
                get_store().dispatch(ACTIONS.selected_annotations.set_selected_ids({
                    selected_compound_ids: props.all_annotation_ids_owned_by_user,
                }))
            }}
        >
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" style={{ width: 20, fill }}>
                <path d="M3 2h18v2H3zm0 18h18v2H3zm0-6h18v2H3zm0-6h18v2H3z"></path>
            </svg>
        </button>
    </div>
}

export const SelectAllButton = connector(_SelectAllButton)
