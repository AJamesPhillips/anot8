import { Store } from "redux"
import { object_to_search_string, parse_location_search } from "../../utils/url"
import { deflate_temporary_annotations, TEMPORARY_ANNOTATIONS_PARAM_KEY } from "../annotations/temporary_annotations"
import { Annotation } from "../interfaces"
import { State } from "../state"



export function update_page_location (store: Store<State>)
{
    let selected_compound_ids: string[] = []
    let all_annotations: Annotation[] = []

    store.subscribe(() => {
        const state = store.getState()

        const current_selected_compound_ids = state.selected_annotations.selected_compound_ids
        const current_all_annotations = state.annotations.all_annotations

        if (selected_compound_ids === current_selected_compound_ids
            && all_annotations === current_all_annotations) return
        selected_compound_ids = current_selected_compound_ids
        all_annotations = current_all_annotations

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

        const temp_annotations = state.annotations.all_annotations.filter(({ temporary }) => temporary)
        delete obj[TEMPORARY_ANNOTATIONS_PARAM_KEY]
        if (temp_annotations.length)
        {
            const temp_annotations_string = deflate_temporary_annotations(temp_annotations)
            obj[TEMPORARY_ANNOTATIONS_PARAM_KEY] = temp_annotations_string
        }


        const search_string = object_to_search_string(obj)
        const new_url = window.location.protocol + "//" + window.location.host + window.location.pathname + search_string

        if (new_url === window.location.toString()) return


        if (window.history.pushState)
        {
            window.history.pushState({ path: new_url }, "", new_url)
        }
        else window.location.href = new_url
    })
}
