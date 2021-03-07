import { get_starting_annotations_state } from "./annotations/starting_state"
import { get_starting_loading_state } from "./loading/starting_state"
import { get_starting_rendering_pdf_state } from "./pdf_rendering/starting_state"
import { get_starting_routing_state } from "./routing/starting_state"
import { get_starting_selected_annotations_state } from "./selected_annotations/starting_state"
import { State } from "./state"



export function get_starting_state (): State
{
    const running_locally = window.location.host !== "anot8.org"
    const override_naming_authority_server_url = localStorage.getItem("override_naming_authority_server_url") || ""

    return {
        annotations: get_starting_annotations_state(),
        loading_pdf: get_starting_loading_state(),
        override_naming_authority_server_url,
        rendering_pdf: get_starting_rendering_pdf_state(),
        routing: get_starting_routing_state(),
        running_locally,
        selected_annotations: get_starting_selected_annotations_state(),
    }
}
