


export function scroll_to_entries (annotations_list_el: HTMLElement, selected_compound_ids: string[])
{
    const an_id = selected_compound_ids[selected_compound_ids.length - 1]

    if (!an_id) return

    // Scroll to highlighted annotation_list_el
    const class_name = `annotation_list_element annotation_${an_id}`
    const an_list_el = document.getElementsByClassName(class_name)[0] as HTMLElement

    if (!an_list_el) return false

    annotations_list_el.scrollTop = an_list_el.offsetTop - 10
}
