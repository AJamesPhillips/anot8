import { Store } from "redux"

import { State } from "../state/state"
import { scroll_to_entries } from "./annotations_list/scroll_to_entries"
import { scroll_to_annotations_on_pdf } from "./annotations_on_pdf/scroll_to_annotations_on_pdf"



export function setup_scrollers (store: Store<State>)
{
    let selected_compound_ids: Set<string>

    store.subscribe(() =>
    {
        const current_selected_compound_ids = store.getState().selected_annotations.selected_compound_ids
        if (selected_compound_ids === current_selected_compound_ids) return

        selected_compound_ids = current_selected_compound_ids

        scroll_to_entries(selected_compound_ids)
        scroll_to_annotations_on_pdf(selected_compound_ids)
    })
}
