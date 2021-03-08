import { h } from "preact"
import { ACTIONS } from "../state/actions"

import { State } from "../state/state"
import { get_store } from "../state/store"
import { connect } from "../utils/preact-redux-simple/connect"



interface OwnProps {}


const map_state = (state: State) => ({
    selected_annotation_ids_owned_by_user: get_selected_annotation_ids_owned_by_user(state),
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)



function _DeleteButton (props: Props)
{
    return <button
        disabled={!props.selected_annotation_ids_owned_by_user}
        title="Delete annotations"
        onClick={() => {
            const compound_ids = props.selected_annotation_ids_owned_by_user.split(",")
            get_store().dispatch(ACTIONS.annotations.delete_annotations({ compound_ids }))
        }}
    >X</button>
}

export const DeleteButton = connector(_DeleteButton)



function get_selected_annotation_ids_owned_by_user(state: State)
{
    const { safe_user_name } = state.user
    const ids = state.selected_annotations.selected_compound_ids.map(id =>
    {
        return state.annotations.annotations_by_compound_id[id]
    })
    .filter(a => a && a.safe_user_name === safe_user_name)
    .map(a => a!.compound_id)

    return ids.join(",")
}
