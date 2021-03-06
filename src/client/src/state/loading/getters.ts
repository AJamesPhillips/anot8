import { State } from "../state"


export function get_url_to_file (state: State)
{
    const { resolved_relative_file_path } = state.loading
    if (!resolved_relative_file_path) return ""

    if (state.running_locally)
    {
        const { vault_id } = state.routing
        return `/serve_file/${vault_id}?relative_file_path=${resolved_relative_file_path}`
    }

    if (!state.loading.vault_config_loaded) return ""
    const { publish_root_path } = state.loading
    return `${publish_root_path}${resolved_relative_file_path}`
}



export function get_url_to_file_annotations (state: State)
{
    const { resolved_relative_file_path } = state.loading
    if (!resolved_relative_file_path) return ""

    if (state.running_locally)
    {
        const { vault_id } = state.routing
        return `/serve_file/${vault_id}?relative_file_path=${resolved_relative_file_path}.annotations`
    }

    if (!state.loading.vault_config_loaded) return ""
    const { publish_root_path } = state.loading
    return `${publish_root_path}${resolved_relative_file_path}.annotations`
}



export function get_url_to_write_file_annotations (state: State)
{
    if (!state.running_locally) return ""

    const { resolved_relative_file_path } = state.loading
    if (!resolved_relative_file_path) return ""

    const { vault_id } = state.routing
    return `/annotations/${vault_id}?relative_file_path=${resolved_relative_file_path}.annotations`
}
