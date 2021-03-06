import { RoutingState } from "../state"



function parse_location_path () {
    const parts = window.location.pathname.split("/")
        .filter(p => !!p)

    const naming_authority_and_vault_ids = parts[parts.length - 2]
    const [naming_authority, vault_id] = naming_authority_and_vault_ids.split(".")

    const file_id = parts[parts.length - 1]

    return {
        naming_authority,
        vault_id,
        file_id,
    }
}



function parse_location_search ()
{
    const query = window.location.search.substring(1)
    const vars: { [key: string]: string } = {}

    if (query)
    {
        query.split("&").forEach(key_var => {
            const [key, _var] = key_var.split("=")
            vars[decodeURIComponent(key)] = decodeURIComponent(_var)
        })
    }

    return vars
}



export function get_starting_routing_state (): RoutingState
{
    const vars = parse_location_search()

    return {
        ...parse_location_path(),
        relative_file_path: vars.relative_file_path,
    }
}
