import { Action, AnyAction } from "redux"
import { Annotation, AnnotationsFile } from "../interfaces"



interface GotAnnotationsFileArgs
{
    annotations_file: AnnotationsFile
    user_name: string
    allow_overwrite: boolean
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



export const annotations_actions = {
    got_annotations_file,
    create_annotation,
    edit_annotation,
}
