import { Store } from "redux"

import { State } from "../state/state"
import { scroll_to_entries } from "./annotations_list/scroll_to_entries"
import { scroll_to_annotations_on_pdf } from "./annotations_on_pdf/scroll_to_annotations_on_pdf"



export function setup_scrollers (annotations_list_el: HTMLElement, store: Store<State>)
{
    let selected_compound_ids: string[] = []
    let scroll_to_entries_succeeded: boolean | undefined
    let scroll_to_annotations_succeeded: boolean | undefined

    store.subscribe(() =>
    {
        const state = store.getState()
        const current_selected_compound_ids = state.selected_annotations.selected_compound_ids
        if (selected_compound_ids === current_selected_compound_ids) return

        selected_compound_ids = current_selected_compound_ids

        scroll_to_entries_succeeded = scroll_to_entries(annotations_list_el, selected_compound_ids)
        scroll_to_annotations_succeeded = scroll_to_annotations_on_pdf(selected_compound_ids)
    })

    const unsubscribe = store.subscribe(() =>
    {
        const state = store.getState()
        const pdf_rendered = state.rendering_pdf.status === "finished"
        if (pdf_rendered) unsubscribe()

        if (scroll_to_entries_succeeded === false)
        {
            scroll_to_entries_succeeded = scroll_to_entries(annotations_list_el, selected_compound_ids)
        }

        if (scroll_to_annotations_succeeded === false)
        {
            scroll_to_annotations_succeeded = scroll_to_annotations_on_pdf(selected_compound_ids)
        }
    })
}
