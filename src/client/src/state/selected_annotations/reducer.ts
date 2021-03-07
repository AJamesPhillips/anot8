import { AnyAction } from "redux"
import { toggle_list_entry } from "../../utils/list"
import { update_substate } from "../../utils/update_state"
import { is_create_annotation } from "../annotations/actions"

import { State } from "../state"
import { is_set_selected_ids, is_toggle_annotation_highlight } from "./actions"



export function selected_annotations_reducer (state: State, action: AnyAction): State
{
    if (is_toggle_annotation_highlight(action))
    {
        const selected_compound_ids = toggle_list_entry(
            state.selected_annotations.selected_compound_ids, action.compound_id)
        state = update_substate(state, "selected_annotations", "selected_compound_ids", selected_compound_ids)
    }


    if (is_create_annotation(action))
    {
        const selected_compound_ids = [action.new_annotation.compound_id]
        state = update_substate(state, "selected_annotations", "selected_compound_ids", selected_compound_ids)
    }


    if (is_set_selected_ids(action))
    {
        state = update_substate(state, "selected_annotations", "selected_compound_ids", action.selected_compound_ids)
    }


    return state
}
