import { MaybeAnnotation, Annotation } from "../interfaces"
import { State, AnnotationsBySafeUserName, AnnotationsByPageNumber, AnnotationsByCompoundId, AnnotationsState } from "../state"
import { get_all_annotations } from "./getters"
import { is_not_deleted } from "./utils"



interface PrepareNewAnnotationsArgs
{
    annotations_state: AnnotationsState
    new_maybe_annotations: MaybeAnnotation[]
    safe_user_name: string
    // allow_merge: boolean
    allow_overwrite: boolean
}
export function prepare_new_annotations (args: PrepareNewAnnotationsArgs)
{
    const { annotations_state, new_maybe_annotations, safe_user_name, allow_overwrite } = args

    const annotations_by_safe_user_name = add_new_annotations_by_safe_user_name({
        annotations_by_safe_user_name: annotations_state.annotations_by_safe_user_name,
        new_annotations: new_maybe_annotations,
        safe_user_name,
        // allow_merge,
        // allow_overwrite,
    })

    const all_annotations = get_all_annotations(annotations_by_safe_user_name)

    const new_annotations = new_maybe_annotations.filter(is_not_deleted)
    const annotations_by_page_number = allow_overwrite
        ? get_annotations_by_page_number(all_annotations)
        : add_new_annotations_by_page_number(
        annotations_state.annotations_by_page_number, new_annotations)
    const annotations_by_compound_id = add_new_annotations_by_compound_id(
        annotations_state.annotations_by_compound_id, new_annotations)

    return {
        annotations_by_safe_user_name,
        all_annotations,
        annotations_by_page_number,
        annotations_by_compound_id,
    }
}



interface AddNewAnnotationsBySafeUserNameArgs
{
    annotations_by_safe_user_name: AnnotationsBySafeUserName
    new_annotations: MaybeAnnotation[]
    safe_user_name: string
    // allow_merge: boolean
    // allow_overwrite: boolean
}
function add_new_annotations_by_safe_user_name (args: AddNewAnnotationsBySafeUserNameArgs): AnnotationsBySafeUserName
{
    const {
        annotations_by_safe_user_name,
        safe_user_name,
        // allow_merge,
        // allow_overwrite,
    } = args
    let { new_annotations } = args

    const existing_annotations = annotations_by_safe_user_name[safe_user_name] || []
    new_annotations = [...existing_annotations, ...new_annotations]

    return {
        ...annotations_by_safe_user_name,
        [safe_user_name]: new_annotations,
    }
}



function get_annotations_by_page_number (all_annotations: Annotation[])
{
    const annotations_by_page_number: AnnotationsByPageNumber = {}
    const unique_page_numbers = Array.from(new Set(all_annotations.map(a => a.page_number)))

    unique_page_numbers.forEach(page_number =>
    {
        annotations_by_page_number[page_number] = []
    })

    all_annotations.map(a =>
    {
        annotations_by_page_number[a.page_number]!.push(a)
    })

    return annotations_by_page_number
}



function add_new_annotations_by_page_number (annotations_by_page_number: AnnotationsByPageNumber, new_annotations: Annotation[]): AnnotationsByPageNumber
{
    annotations_by_page_number = { ...annotations_by_page_number }

    const unique_page_numbers = Array.from(new Set(new_annotations.map(a => a.page_number)))

    unique_page_numbers.forEach(page_number =>
    {
        annotations_by_page_number[page_number] = [...(annotations_by_page_number[page_number] || [])]
    })

    new_annotations.map(a =>
    {
        annotations_by_page_number[a.page_number]!.push(a)
    })

    return annotations_by_page_number
}



function add_new_annotations_by_compound_id (annotations_by_compound_id: AnnotationsByCompoundId, new_annotations: Annotation[]): AnnotationsByCompoundId
{
    annotations_by_compound_id = { ...annotations_by_compound_id }

    new_annotations.map(a =>
    {
        annotations_by_compound_id[a.compound_id] = a
    })

    return annotations_by_compound_id
}
