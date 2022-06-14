import { Annotation } from "../interfaces"
import { get_safe_user_name } from "../user/utils"
import { get_compound_id } from "./utils"



export const TEMPORARY_ANNOTATIONS_PARAM_KEY = "ta"



export function deflate_temporary_annotations (annotations: Annotation[])
{
    return JSON.stringify(annotations.map(deflate_temporary_annotation))
}


function deflate_temporary_annotation (annotation: Annotation)
{
    const { colour, comment, height, id, labels, left, page_number, text, top, width, user_name, } = annotation

    const compressed_colour = colour.replace(/ /g, "").trim()
    const compressed_height = height.replace("px", "").trim()
    const compressed_left = left.replace("px", "").trim()
    const compressed_top = top.replace("px", "").trim()
    const compressed_width = width.replace("px", "").trim()

    return [
        id,
        page_number,
        comment,
        text,
        labels,
        compressed_left,
        compressed_top,
        compressed_width,
        compressed_height,
        // compressed_colour,
        user_name,
        // compound_id, // we are ignoring the compound id including the user name
    ]

    // const safe_comment = comment.replace(/-/g, "_-")
    // // const compressed_id = id
    // const safe_labels = JSON.stringify(labels.map(label => label.replace(/-/g, "_-")))
    // // const compressed_page_number = page_number
    // const safe_text = text.replace(/-/g, "_-")

    // return `${id}-${page_number}-${safe_comment}-${safe_text}-${safe_labels}-${compressed_colour}-${compressed_left}-${compressed_top}-${compressed_width}-${compressed_height}`
}



export function inflate_temporary_annotations (temp_annotations: string | undefined): Annotation[]
{
    if (!temp_annotations) return []

    try
    {
        const annotations = JSON.parse(temp_annotations)

        return annotations.map((deflated_annotation: any) =>
        {
            const [
                id,
                page_number,
                comment,
                text,
                labels,
                left,
                top,
                width,
                height,
                // colour,
                user_name = "", // default to "" as it was not in previous versions of deflated annotations
            ] = deflated_annotation

            const safe_user_name = get_safe_user_name(user_name)

            return {
                id,
                page_number,
                comment,
                text,
                labels,
                colour: "rgba(200,200,255,0.6)",
                left: left + "px",
                top: top + "px",
                width: width + "px",
                height: height + "px",

                user_name,
                safe_user_name: get_safe_user_name(user_name),
                // assume it is from the anonymous / root user
                compound_id: get_compound_id({ id, safe_user_name }),

                dirty: true,
                temporary: true,
            }
        })
    }
    catch (e)
    {
        console.error(`Error parsing temp_annotations: `, e)
        return []
    }
}
