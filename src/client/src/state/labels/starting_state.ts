import { LabelsState } from "../state"



const LOCAL_STORAGE_HIGHLIGHTING_USED_LABELS_KEY = "highlighting_used_labels"
export function get_starting_labels_state (): LabelsState
{
    return {
        labels_by_id: {},
        highlighting_used_labels: get_item_boolean(LOCAL_STORAGE_HIGHLIGHTING_USED_LABELS_KEY, true),
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
    localStorage.setItem(LOCAL_STORAGE_HIGHLIGHTING_USED_LABELS_KEY, value ? "1" : "0")
}



const LOCAL_STORAGE_PRIORITY_LABELS_KEY = "priority_labels"
export function store_priority_labels (labels: string[])
{
    localStorage.setItem(LOCAL_STORAGE_PRIORITY_LABELS_KEY, JSON.stringify(labels))
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
        return new Set(JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRIORITY_LABELS_KEY) || "[]"))
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
