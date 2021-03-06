import { AnnotationsState } from "../state"



export function get_starting_annotations_state (): AnnotationsState
{
    return {
        status: "not ready",
        annotation_user_names: undefined,
        main_annotations: undefined,
    }
}
