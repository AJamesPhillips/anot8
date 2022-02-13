import { AnyAction } from "redux"
import { toggle_set_entry } from "../../utils/set"

import { update_substate } from "../../utils/update_state"
import { is_set_vault_config } from "../loading/actions"
import { Label, LabelsById, LabelsState, State } from "../state"
import { is_set_highlighting_used_labels, is_set_labels_used_by_selected_annotations, is_set_search_string, is_set_used_labels, is_toggle_label_priority } from "./actions"
import { store_priority_labels, store_setting_highlighting_used_labels } from "./starting_state"



export function labels_reducer (state: State, action: AnyAction): State
{
    if (is_set_vault_config(action))
    {
        const labels_by_id = get_labels_by_id(action.config.labels, state)

        const labels: LabelsState = {
            ...state.labels,
            labels_by_id,
            label_ids_list_to_display: get_label_ids_list_to_display(labels_by_id),
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


    if (is_toggle_label_priority(action))
    {
        const label_str = action.toggle_label_priority

        let label = state.labels.labels_by_id[label_str]
        if (label)
        {
            const priority_labels = state.labels.priority_labels
            toggle_set_entry(priority_labels, label_str)
            const priority = priority_labels.has(label_str)
            label = { ...label, priority }

            const labels_by_id: LabelsById = { ...state.labels.labels_by_id, [label_str]: label }
            const label_ids_list_to_display = get_label_ids_list_to_display(labels_by_id)

            const labels_state: LabelsState = {
                ...state.labels,
                priority_labels,
                labels_by_id,
                label_ids_list_to_display,
            }
            state = { ...state, labels: labels_state }

            store_priority_labels(Array.from(priority_labels))
        }
    }


    return state
}



function get_labels_by_id (labels: string[], state: State): LabelsById
{
    const priority_labels = state.labels.priority_labels
    const hide_label_roots = state.labels.hide_label_roots

    const labels_by_id: LabelsById = {}

    labels.forEach(label =>
    {
        const display_text = hide_label_roots.reduce((accum, to_remove) =>
        {
            if (!accum.startsWith(to_remove)) return accum

            return accum.replace(to_remove, "")
        }, label)

        labels_by_id[label] = {
            value: label,
            lower_case_value: label.toLowerCase(),
            display_text,
            priority: priority_labels.has(label),
        }
    })

    return labels_by_id
}



function get_label_ids_list_to_display (labels_by_id: LabelsById): string[]
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
