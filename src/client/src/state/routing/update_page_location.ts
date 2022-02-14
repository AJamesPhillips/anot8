import { Store } from "redux"
import { object_to_search_string, parse_location_search } from "../../utils/url"
import { State } from "../state"



export function update_page_location (store: Store<State>)
{
    let selected_compound_ids: string[] = []

    store.subscribe(() => {
        const state = store.getState()
        const current_selected_compound_ids = state.selected_annotations.selected_compound_ids
        if (selected_compound_ids === current_selected_compound_ids) return
        selected_compound_ids = current_selected_compound_ids

        const obj = parse_location_search()
        delete obj["h"]
        delete obj["highlighted_annotation_ids"] // legacy

        if (selected_compound_ids.length)
        {
            obj["h"] = selected_compound_ids.join(",")
        }

        const { naming_authority, vault_id, file_id } = state.routing
        if (obj["url"] && naming_authority && vault_id && file_id)
        {
            // Clean up parameters by removing url if there is a path specifying the file to load
            delete obj["url"]
        }

        const search_string = object_to_search_string(obj)
        const new_url = window.location.protocol + "//" + window.location.host + window.location.pathname + search_string

        if (window.history.pushState)
        {
            window.history.pushState({ path: new_url }, "", new_url)
        }
        else window.location.href = new_url
    })
}
