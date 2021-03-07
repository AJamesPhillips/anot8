import { Store } from "redux"

import { State } from "../state/state"



export function set_up_programmatic_styles (programmatic_styles_el: HTMLElement, store: Store<State>)
{
    let selected_compound_ids: Set<string>

    store.subscribe(() =>
    {
        const current_selected_compound_ids = store.getState().selected_annotations.selected_compound_ids
        if (selected_compound_ids === current_selected_compound_ids) return

        selected_compound_ids = current_selected_compound_ids

        programmatic_styles_el.innerHTML = ""

        if (!selected_compound_ids.size) return

        const class_names = Array.from(selected_compound_ids).map(id => `.annotation_${id}`).join(",")
        // TODO: remove `!important` hack
        programmatic_styles_el.innerHTML = `${class_names} { background-color: rgba(255, 245, 150, 0.7) !important; }`
    })
}
