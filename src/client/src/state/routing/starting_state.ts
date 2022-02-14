import { parse_location_search } from "../../utils/url"
import { RoutingState } from "../state"



function parse_location_path () {
    const parts = window.location.pathname.split("/")
        .filter(p => !!p)

    const naming_authority_and_vault_ids = parts[1] || ""
    const [naming_authority = "", vault_id = ""] = naming_authority_and_vault_ids.split(".")

    const file_id = parts[2] || ""

    return {
        naming_authority,
        vault_id,
        file_id,
    }
}



export function get_starting_routing_state (): RoutingState
{
    const path_location = parse_location_path()
    const vars = parse_location_search()

    const have_valid_path_location = !!path_location.naming_authority && !!path_location.vault_id && !!path_location.file_id

    return {
        ...path_location,
        relative_file_path: vars.relative_file_path,
        url: have_valid_path_location ? undefined : vars.url,
        doi: undefined, //vars.doi,
    }
}
