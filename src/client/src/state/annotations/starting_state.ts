import { parse_location_search } from "../../utils/url"
import { Annotation } from "../interfaces"
import { AnnotationsState } from "../state"
import { prepare_new_annotations } from "./prepare_new_annotations"
import { inflate_temporary_annotations, TEMPORARY_ANNOTATIONS_PARAM_KEY } from "./temporary_annotations"



export function get_starting_annotations_state (): AnnotationsState
{
    let state: AnnotationsState = {
        status: "not ready",
        annotation_files_to_load: [""],
        annotation_files_loaded: [],
        unsupported_schema_version: undefined,
        annotation_user_names: undefined,
        annotations_by_safe_user_name: {},
        all_annotations: [],
        annotations_by_compound_id: {},
        annotations_by_page_number: {},
    }


    const temp_annotations = parse_location_search()[TEMPORARY_ANNOTATIONS_PARAM_KEY]
    const new_maybe_annotations: Annotation[] = inflate_temporary_annotations(temp_annotations)

    state = {
        ...state,
        ...prepare_new_annotations({
            annotations_state: state,
            new_maybe_annotations,
            safe_user_name: "",
            allow_overwrite: true,
        })
    }


    return state
}
