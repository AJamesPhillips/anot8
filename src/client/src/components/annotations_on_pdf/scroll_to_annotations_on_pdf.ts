


export function scroll_to_annotations_on_pdf (selected_compound_ids: string[])
{
    if (an_annotation_in_view(selected_compound_ids)) return

    const an_id = selected_compound_ids[0]
    if (!an_id) return

    return scroll_to_annotation(an_id)
}



function an_annotation_in_view (selected_compound_ids: string[])
{
    let one_in_view = false

    selected_compound_ids.forEach(compound_id =>
    {
        one_in_view = one_in_view || annotation_in_view(compound_id)
    })
    return one_in_view
}



function annotation_in_view (compound_id: string)
{
    const el = document.getElementsByClassName(`annotation annotation_${compound_id}`)[0]
    if (!(el && el.getBoundingClientRect)) return false

    const rect = el.getBoundingClientRect()

    return (
        rect.top >= 0 &&
        //rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) //&& /* or $(window).height() */
        //rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    )
}


function scroll_to_annotation (compound_id: string)
{
    // console .log("Annotations not in view")
    const class_name = `annotation annotation_${compound_id}`
    const el = document.getElementsByClassName(class_name)[0]
    if (!(el && el.scrollIntoView)) return false
    el.scrollIntoView()
}
