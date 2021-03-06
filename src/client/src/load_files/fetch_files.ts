import { get_url_to_file, get_url_to_file_annotations } from "../state/loading/getters"
import { get_store } from "../state/store"



export function fetch_files ()
{
    const store = get_store()
    const state = store.getState()

    const pdf_file_url = get_url_to_file(state)
    const file_annotations_url = get_url_to_file_annotations(state)

    console.log("pdf_file_url...", pdf_file_url)
}
