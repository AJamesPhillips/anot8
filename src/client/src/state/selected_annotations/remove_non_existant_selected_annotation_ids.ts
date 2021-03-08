import { Store } from "redux"

import { ACTIONS } from "../actions"
import { State } from "../state"



export function remove_non_existant_selected_annotation_ids (store: Store<State>)
{
    const unsubscribe = store.subscribe(() =>
    {
        const state = store.getState()
        if (state.annotations.status !== "loaded") return
        if (state.annotations.status === "loaded") unsubscribe()

        const current_selected_compound_ids = state.selected_annotations.selected_compound_ids
        const selected_compound_ids = current_selected_compound_ids
            .filter(compound_id =>
            {
                const annotation = state.annotations.annotations_by_compound_id[compound_id]
                return annotation && !annotation.deleted
            })

        if (selected_compound_ids.length !== current_selected_compound_ids.length)
        {
            store.dispatch(ACTIONS.selected_annotations.set_selected_ids({ selected_compound_ids }))
        }
    })
}
