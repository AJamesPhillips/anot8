import { h, render } from "preact"

import { AnnotationsList } from "./components/annotations_list/AnnotationsList"
import { App } from "./app"
import { LoadingProgress } from "./components/LoadingProgress"
import { load_files } from "./load_files/load_files"
import { TopInfoPanel } from "./components/TopInfoPanel"
import { AutoSave } from "./components/side_panel/AutoSave"



const link_to_pdf_el = document.getElementById("link_to_pdf_file")
render(<TopInfoPanel />, link_to_pdf_el!)

// const annotations_list_el = document.getElementById("annotations_list")
// render(<AnnotationsList />, annotations_list_el)

const pages_container_el = document.getElementById("pages_container")
render(<App />, pages_container_el!)

const loading_progress_el = document.getElementById("loading_progress")
render(<LoadingProgress />, loading_progress_el!)

const auto_save_el = document.getElementById("auto_save")
render(<AutoSave />, auto_save_el!)

load_files()
