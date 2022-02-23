import { h, render } from "preact"

import { AnnotationsList } from "./components/side_panel/annotations_list/AnnotationsList"
import { Labels } from "./components/side_panel/labels_list/Labels"
import { LoadingProgress } from "./components/loading_progress/LoadingProgress"
import { render_pdf } from "./components/pdf_canvas/render_pdf"
import { setup_scrollers } from "./components/setup_scrollers"
import { set_up_programmatic_styles } from "./components/set_up_programmatic_styles"
import { AnnotationDetails } from "./components/side_panel/AnnotationDetails"
import { AuthorInfo } from "./components/side_panel/AuthorInfo"
import { AutoSave } from "./components/side_panel/AutoSave"
import { TopInfoPanel } from "./components/TopInfoPanel"
import { load_files } from "./load_files/load_files"
import { auto_save } from "./state/annotations/auto_save"
import { update_labels_used_by_selected_annotations } from "./state/labels/update_labels_used_by_selected"
import { update_used_labels } from "./state/labels/update_used_labels"
import { update_page_location } from "./state/routing/update_page_location"
import { remove_non_existant_selected_annotation_ids } from "./state/selected_annotations/remove_non_existant_selected_annotation_ids"
import { get_store } from "./state/store"
import { AnnotationActions } from "./components/side_panel/AnnotationActions"



const store = get_store()
update_page_location(store)
remove_non_existant_selected_annotation_ids(store)
auto_save(store)
update_used_labels(store)
update_labels_used_by_selected_annotations(store)


const pages_container_el = document.getElementById("pages_container")!
load_files()
.then(pdf => render_pdf(pdf, pages_container_el))
.catch(e =>
{
    const state = store.getState()
    if (state.loading_pdf.loading_error_type === "422") return
    console.error("Erroring during loading files: ", e)
})

const programmatic_styles_el = document.getElementById("programmatic_styles")!
set_up_programmatic_styles(programmatic_styles_el, store)

const loading_progress_el = document.getElementById("loading_progress")!
render(<LoadingProgress />, loading_progress_el)

const link_to_pdf_el = document.getElementById("link_to_pdf_file")!
render(<TopInfoPanel />, link_to_pdf_el)

const auto_save_el = document.getElementById("auto_save")!
render(<AutoSave />, auto_save_el)

const author_info_el = document.getElementById("author_info")!
render(<AuthorInfo />, author_info_el)

const annotation_actions_el = document.getElementById("annotation_actions")!
render(<AnnotationActions />, annotation_actions_el)

const annotations_list_el = document.getElementById("annotations_list")!
render(<AnnotationsList />, annotations_list_el)

const annotation_details_el = document.getElementById("annotation_details")!
render(<AnnotationDetails />, annotation_details_el)

const labels_list_el = document.getElementById("labels_list")!
labels_list_el.innerHTML = ""
render(<Labels />, labels_list_el)


setup_scrollers(annotations_list_el, store)
