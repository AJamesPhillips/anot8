import { Action, AnyAction } from "redux"
import { AnnotationsFile } from "../interfaces"



interface GotMainAnnotationsFileArgs
{
    annotations_file: AnnotationsFile
}
interface ActionGotMainAnnotationsFile extends Action, GotMainAnnotationsFileArgs {}

const got_main_annotations_file_type = "got_main_annotations_file"

const got_main_annotations_file = (args: GotMainAnnotationsFileArgs): ActionGotMainAnnotationsFile =>
{
    return { type: got_main_annotations_file_type, ...args }
}

export const is_got_main_annotations_file = (action: AnyAction): action is ActionGotMainAnnotationsFile => {
    return action.type === got_main_annotations_file_type
}



export const annotations_actions = {
    got_main_annotations_file
}
