import { h, render } from "preact"

import { AnnotationsContainer } from "./AnnotationsContainer"



interface AddAnnotationsToPDFPageArgs
{
    annotations_container_el: HTMLElement
    page_number: number
}
export function add_annotations_to_PDF_page (args: AddAnnotationsToPDFPageArgs)
{
    const { annotations_container_el, page_number } = args

    render(<AnnotationsContainer page_number={page_number} />, annotations_container_el)
}
