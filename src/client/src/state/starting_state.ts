import { get_starting_routing_state } from "./routing/starting_state"
import { get_starting_loading_state } from "./loading/starting_state"
import { State } from "./state"
import { get_starting_annotations_state } from "./annotations/starting_state"



export function get_starting_state (): State
{
    const running_locally = window.location.host !== "anot8.org"
    const override_naming_authority_server_url = localStorage.getItem("override_naming_authority_server_url") || ""

    return {
        routing: get_starting_routing_state(),
        running_locally,
        override_naming_authority_server_url,
        loading_pdf: get_starting_loading_state(),
        annotations: get_starting_annotations_state(),
    }
}
