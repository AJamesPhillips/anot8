import { parse_location_search } from "../../utils/url"
import { SelectedAnnotationsState } from "../state"



export function get_starting_selected_annotations_state (): SelectedAnnotationsState
{
    const vars = parse_location_search()

    const h1_ids = get_compound_ids(vars["h"])
    const h2_ids = get_compound_ids(vars["highlighted_annotation_ids"]) // legacy
    const selected_compound_ids = h1_ids.concat(h2_ids)

    return {
        selected_compound_ids,
    }
}



function get_compound_ids (str: string = ""): string[]
{
    return str ? str.split(",") : []
}
