import { Action, AnyAction } from "redux"
import { LabelCount } from "../state"



interface SetHighlightingUsedLabelsArgs
{
    highlighting: boolean
}
interface ActionSetHighlightingUsedLabels extends Action, SetHighlightingUsedLabelsArgs {}

const set_highlighting_used_labels_type = "set_highlighting_used_labels"

const set_highlighting_used_labels = (args: SetHighlightingUsedLabelsArgs): ActionSetHighlightingUsedLabels =>
{
    return { type: set_highlighting_used_labels_type, ...args }
}

export const is_set_highlighting_used_labels = (action: AnyAction): action is ActionSetHighlightingUsedLabels => {
    return action.type === set_highlighting_used_labels_type
}



interface SetSearchStringArgs
{
    search: string
}
interface ActionSetSearchString extends Action, SetSearchStringArgs {}

const set_search_string_type = "set_search_string"

const set_search_string = (args: SetSearchStringArgs): ActionSetSearchString =>
{
    return { type: set_search_string_type, ...args }
}

export const is_set_search_string = (action: AnyAction): action is ActionSetSearchString => {
    return action.type === set_search_string_type
}



interface SetUsedLabelsArgs
{
    used_labels: Set<string>
}
interface ActionSetUsedLabels extends Action, SetUsedLabelsArgs {}

const set_used_labels_type = "set_used_labels"

const set_used_labels = (args: SetUsedLabelsArgs): ActionSetUsedLabels =>
{
    return { type: set_used_labels_type, ...args }
}

export const is_set_used_labels = (action: AnyAction): action is ActionSetUsedLabels => {
    return action.type === set_used_labels_type
}



interface SetLabelsUsedBySelectedAnnotationsArgs
{
    labels_used_by_selected_annotations: LabelCount
}
interface ActionSetLabelsUsedBySelectedAnnotations extends Action, SetLabelsUsedBySelectedAnnotationsArgs {}

const set_labels_used_by_selected_annotations_type = "set_labels_used_by_selected_annotations"

const set_labels_used_by_selected_annotations = (args: SetLabelsUsedBySelectedAnnotationsArgs): ActionSetLabelsUsedBySelectedAnnotations =>
{
    return { type: set_labels_used_by_selected_annotations_type, ...args }
}

export const is_set_labels_used_by_selected_annotations = (action: AnyAction): action is ActionSetLabelsUsedBySelectedAnnotations => {
    return action.type === set_labels_used_by_selected_annotations_type
}



export const labels_actions = {
    set_highlighting_used_labels,
    set_search_string,
    set_used_labels,
    set_labels_used_by_selected_annotations,
}
