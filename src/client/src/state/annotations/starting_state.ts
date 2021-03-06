import { AnnotationsState } from "../state"



export function get_starting_annotations_state (): AnnotationsState
{
    return {
        status: "not ready",
    }
}
