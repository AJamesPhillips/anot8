import { SelectedAnnotationsState } from "../state"



export function get_starting_selected_annotations_state (): SelectedAnnotationsState
{
    return {
        selected_compound_ids: [],
    }
}
