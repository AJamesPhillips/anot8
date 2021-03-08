import { AnyAction } from "redux"

import { update_substate } from "../../utils/update_state"
import { is_set_vault_config } from "../loading/actions"
import { LabelsById, LabelsState, State } from "../state"
import { is_set_highlighting_used_labels, is_set_labels_used_by_selected_annotations, is_set_search_string, is_set_used_labels } from "./actions"
import { store_setting_highlighting_used_labels } from "./starting_state"



export function labels_reducer (state: State, action: AnyAction): State
{
    if (is_set_vault_config(action))
    {
        const labels_by_id = get_labels_by_id(action.config.labels, state.labels.priority_labels)

        const labels: LabelsState = {
            ...state.labels,
            labels_by_id,
            label_ids_list_to_display: label_ids_list_to_display(labels_by_id),
        }
        state = { ...state, labels }
    }


    if (is_set_highlighting_used_labels(action))
    {
        state = update_substate(state, "labels", "highlighting_used_labels", action.highlighting)
        store_setting_highlighting_used_labels(action.highlighting)
    }


    if (is_set_search_string(action))
    {
        const labels: LabelsState = {
            ...state.labels,
            search_string: action.search,
        }
        state = { ...state, labels }
    }


    if (is_set_used_labels(action))
    {
        state = update_substate(state, "labels", "used_labels", action.used_labels)
    }


    if (is_set_labels_used_by_selected_annotations(action))
    {
        state = update_substate(state, "labels", "labels_used_by_selected_annotations", action.labels_used_by_selected_annotations)
    }


    return state
}



function get_labels_by_id (labels: string[], priority_labels: Set<string>): LabelsById
{
    const labels_by_id: LabelsById = {}

    labels.forEach(label =>
    {
        labels_by_id[label] = {
            value: label,
            lower_case_value: label.toLowerCase(),
            priority: priority_labels.has(label),
        }
    })

    return labels_by_id
}



function label_ids_list_to_display (labels_by_id: LabelsById): string[]
{
    return Object.values(labels_by_id)
        .sort((a, b) =>
        {
            if (a.priority === b.priority)
            {
                return a.lower_case_value < b.lower_case_value ? -1 : 1
            }
            else
            {
                return a.priority ? -1 : 1
            }
        })
        .map(({ value }) => value)
}
