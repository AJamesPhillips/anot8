import { Annotation } from "./interfaces"
import { State } from "./state"



export function get_selected_annotation (state: State): Annotation | "none" | "multiple"
{
    const ids = state.selected_annotations.selected_compound_ids
    if (ids.length !== 1) return ids.length === 0 ? "none" : "multiple"

    return state.annotations.annotations_by_compound_id[ids[0]] || "none"
}
