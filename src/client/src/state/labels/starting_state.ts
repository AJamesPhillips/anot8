import { LabelsState } from "../state"



export function get_starting_labels_state (): LabelsState
{
    return {
        labels_by_id: {},
        highlighting_used_labels: get_item_boolean("highlighting_used_labels", true),
        used_labels: new Set(),
        priority_labels: get_priority_labels(),
        hide_label_roots: get_label_roots_to_hide(),
        search_string: "",
        label_ids_list_to_display: [],
        labels_used_by_selected_annotations: {},
    }
}



export function store_setting_highlighting_used_labels (value: boolean)
{
    localStorage.setItem("highlighting_used_labels", value ? "1" : "0")
}



function get_item_boolean (item: string, defalt: boolean)
{
    const value = localStorage.getItem(item)
    if (!value) return defalt
    return value === "1"
}



function get_priority_labels (): Set<string>
{
    try {
        return new Set(JSON.parse(localStorage.getItem("priority_labels") || "[]"))
    } catch
    {
        return new Set()
    }
}



function get_label_roots_to_hide (): string[]
{
    try {
        return JSON.parse(localStorage.getItem("hide_label_roots") || "[]")
    } catch
    {
        return []
    }
}
