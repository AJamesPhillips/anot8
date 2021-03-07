import { Action, AnyAction } from "redux"
import { AnnotationsFile } from "../interfaces"



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



export const annotations_actions = {
    got_annotations_file,
}
