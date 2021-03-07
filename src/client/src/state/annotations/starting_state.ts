import { AnnotationsState } from "../state"



export function get_starting_annotations_state (): AnnotationsState
{
    return {
        status: "not ready",
        annotation_files_to_load: [""],
        annotation_files_loaded: [],
        annotation_user_names: undefined,
        annotations_by_safe_user_name: {},
        all_annotations: [],
        annotations_by_compound_id: {},
        annotations_by_page_number: {},
    }
}
