import { LoadingStatus, State } from "../state"



export function get_url_to_file (state: State)
{
    const { url } = state.routing
    if (url) return url

    const { resolved_relative_file_path } = state.loading_pdf
    if (!resolved_relative_file_path) return ""

    if (state.running_locally)
    {
        const { vault_id } = state.routing
        return `/serve_file/${vault_id}?relative_file_path=${resolved_relative_file_path}`
    }

    if (!state.loading_pdf.vault_config_loaded) return ""
    const { publish_root_path } = state.loading_pdf
    return `${publish_root_path}${resolved_relative_file_path}`
}



export function get_url_to_file_annotations ({ state, safe_user_name }: { state: State, safe_user_name: string })
{
    const { resolved_relative_file_path } = state.loading_pdf
    if (!resolved_relative_file_path) return ""

    const user = get_user_part_of_url(safe_user_name)

    if (state.running_locally)
    {
        const { vault_id } = state.routing
        return `/serve_file/${vault_id}?relative_file_path=${resolved_relative_file_path}${user}.annotations`
    }
    else
    {
        if (!state.loading_pdf.vault_config_loaded) return ""
        const { publish_root_path } = state.loading_pdf
        return `${publish_root_path}${resolved_relative_file_path}${user}.annotations`
    }
}



const states_post_attempt_to_resolve_url_to_write_annotations = new Set<LoadingStatus>([
    LoadingStatus.resolved, LoadingStatus.downloaded, LoadingStatus.errored
])
export function finished_attempt_to_resolve_url_to_write_annotations (state: State)
{
    return states_post_attempt_to_resolve_url_to_write_annotations.has(state.loading_pdf.status)
}


export function get_url_to_write_file_annotations (state: State)
{
    if (!state.running_locally) return ""

    const { resolved_relative_file_path } = state.loading_pdf
    if (!resolved_relative_file_path) return ""

    const { vault_id } = state.routing
    const safe_user_name = state.user.safe_user_name
    const user = get_user_part_of_url(safe_user_name)
    return `/annotations/${vault_id}?relative_file_path=${resolved_relative_file_path}${user}.annotations`
}



function get_user_part_of_url (safe_user_name: string)
{
    return safe_user_name && ("." + safe_user_name)
}
