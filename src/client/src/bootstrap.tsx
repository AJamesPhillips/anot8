import { h, render } from "preact"

import { AnnotationsList } from "./components/annotations_list/AnnotationsList"
import { App } from "./app"
import { LoadingProgress } from "./components/LoadingProgress"
import { load_files } from "./load_files/load_files"



const annotations_list_el = document.getElementById("annotations_list")
render(<AnnotationsList />, annotations_list_el)

const pages_container_el = document.getElementById("pages_container")
render(<App />, pages_container_el)

const loading_progress_el = document.getElementById("loading_progress")
render(<LoadingProgress />, loading_progress_el)

load_files()
