import { AnyAction } from "redux"
import { toggle_set_entry } from "../../utils/set"
import { update_substate } from "../../utils/update_state"

import { State } from "../state"
import { is_toggle_annotation_highlight } from "./actions"



export function selected_annotations_reducer (state: State, action: AnyAction): State
{
    if (is_toggle_annotation_highlight(action))
    {
        const selected_compound_ids = new Set(state.selected_annotations.selected_compound_ids)
        toggle_set_entry(selected_compound_ids, action.compound_id)
        state = update_substate(state, "selected_annotations", "selected_compound_ids", selected_compound_ids)
    }

    return state
}
