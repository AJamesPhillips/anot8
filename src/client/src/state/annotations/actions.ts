import { Action, AnyAction } from "redux"
import { Annotation, AnnotationsFile } from "../interfaces"



interface GotAnnotationsFileArgs
{
    annotations_file: AnnotationsFile
    user_name: string
}
interface ActionGotAnnotationsFile extends Action, GotAnnotationsFileArgs {}

const got_annotations_file_type = "got_annotations_file"

const got_annotations_file = (args: GotAnnotationsFileArgs): ActionGotAnnotationsFile =>
{
    return { type: got_annotations_file_type, ...args }
}

export const is_got_annotations_file = (action: AnyAction): action is ActionGotAnnotationsFile => {
    return action.type === got_annotations_file_type
}



interface GotReplacementAnnotationsFileArgs
{
    annotations_file: AnnotationsFile
    user_name: string
}
interface ActionGotReplacementAnnotationsFile extends Action, GotReplacementAnnotationsFileArgs {}

const got_replacement_annotations_file_type = "got_replacement_annotations_file"

const got_replacement_annotations_file = (args: GotReplacementAnnotationsFileArgs): ActionGotReplacementAnnotationsFile =>
{
    return { type: got_replacement_annotations_file_type, ...args }
}

export const is_got_replacement_annotations_file = (action: AnyAction): action is ActionGotReplacementAnnotationsFile => {
    return action.type === got_replacement_annotations_file_type
}



interface CreateAnnotationArgs
{
    new_annotation: Annotation
}
interface ActionCreateAnnotation extends Action, CreateAnnotationArgs {}

const create_annotation_type = "create_annotation"

const create_annotation = (args: CreateAnnotationArgs): ActionCreateAnnotation =>
{
    return { type: create_annotation_type, ...args }
}

export const is_create_annotation = (action: AnyAction): action is ActionCreateAnnotation => {
    return action.type === create_annotation_type
}



interface EditAnnotationArgs
{
    annotation: Annotation
}
interface ActionEditAnnotation extends Action, EditAnnotationArgs {}

const edit_annotation_type = "edit_annotation"

const edit_annotation = (args: EditAnnotationArgs): ActionEditAnnotation =>
{
    return { type: edit_annotation_type, ...args }
}

export const is_edit_annotation = (action: AnyAction): action is ActionEditAnnotation => {
    return action.type === edit_annotation_type
}



interface ProgressSavingAnnotationsArgs
{
    status: "error" | "saved" | "saving"
    message?: string
}
interface ActionProgressSavingAnnotations extends Action, ProgressSavingAnnotationsArgs {}

const progress_saving_annotations_type = "progress_saving_annotations"

const progress_saving_annotations = (args: ProgressSavingAnnotationsArgs): ActionProgressSavingAnnotations =>
{
    return { type: progress_saving_annotations_type, ...args }
}

export const is_progress_saving_annotations = (action: AnyAction): action is ActionProgressSavingAnnotations => {
    return action.type === progress_saving_annotations_type
}



export const annotations_actions = {
    got_annotations_file,
    got_replacement_annotations_file,
    create_annotation,
    edit_annotation,
    progress_saving_annotations,
}
