import { Store } from "redux"

import { ACTIONS } from "../actions"
import { get_all_selected_annotations } from "../annotations/getters"
import { Annotation } from "../interfaces"
import { AnnotationsByCompoundId, LabelCount, State } from "../state"



export function update_labels_used_by_selected_annotations (store: Store<State>)
{
    let selected_compound_ids: string[]
    let annotations_by_compound_id: AnnotationsByCompoundId

    store.subscribe(() =>
    {
        const state = store.getState()

        if (state.selected_annotations.selected_compound_ids === selected_compound_ids
            && state.annotations.annotations_by_compound_id === annotations_by_compound_id) return
        selected_compound_ids = state.selected_annotations.selected_compound_ids
        annotations_by_compound_id = state.annotations.annotations_by_compound_id

        const annotations = get_all_selected_annotations(state)

        const labels_used_by_selected_annotations = calculate_label_counts(annotations)

        store.dispatch(ACTIONS.labels.set_labels_used_by_selected_annotations({ labels_used_by_selected_annotations }))
    })
}



function calculate_label_counts (annotations: Annotation[])
{
    const label_counts: LabelCount = {}

    annotations.forEach(annotation =>
    {
        annotation.labels.forEach(label =>
        {
            label_counts[label] = (label_counts[label] || 0) + 1
        })
    })

    return label_counts
}
