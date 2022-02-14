import { Annotation } from "../interfaces"
import { AnnotationsState } from "../state"
import { prepare_new_annotations } from "./prepare_new_annotations"



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


    const ans: Annotation[] = [
        // {
        //     colour: "rgba(200, 200, 255, 0.6)",
        //     comment: "Annotation is useful",
        //     height: "27px",
        //     id: 3,
        //     labels: ["label one"],
        //     left: "393px",
        //     page_number: 1,
        //     text: "An annotation",
        //     top: "137px",
        //     width: "80px",

        //     user_name: "",
        //     safe_user_name: "",
        //     compound_id: "3",
        // }
    ]

    state = {
        ...state,
        ...prepare_new_annotations({
            annotations_state: state,
            new_maybe_annotations: ans,
            safe_user_name: "",
            allow_overwrite: true,
        })
    }


    return state
}
