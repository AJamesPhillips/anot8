import { ACTIONS } from "../state/actions"
import { NamingAuthorityConfigURLLookup, VaultsConfigURLLookup, VaultConfig } from "../state/interfaces"
import { State } from "../state/state"
import { get_store } from "../state/store"



export function resolve_relative_file_path ()
{
    const store = get_store()
    const state = store.getState()
    const naming_authority_lookup_url = get_naming_authority_lookup_url(state)


    store.dispatch(ACTIONS.update_loading_status({ status: "resolving", stage: "resolve_naming_authority_url" }))


    return fetch(naming_authority_lookup_url)
    .then(resp => resp.json())
    .then((naming_authority_lookup: NamingAuthorityConfigURLLookup) =>
    {
        const { naming_authority } = state.routing

        const vaults_map_url = naming_authority_lookup[naming_authority]
        if (!vaults_map_url)
        {
            const msg = `No naming_authority ${naming_authority} in naming_authority_lookup`
            console.error(msg, naming_authority_lookup)

            store.dispatch(ACTIONS.error_during_loading({ error_stage: "resolve_naming_authority_url", error_type: "404" }))

            return Promise.reject()
        }

        store.dispatch(ACTIONS.update_loading_status({ status: "resolving", stage: "resolve_vault_url" }))

        return fetch(vaults_map_url)
    })
    .then(resp => resp.json())
    .then((vaults_map: VaultsConfigURLLookup) =>
    {
        const { vault_id } = state.routing

        const vault_config_url = vaults_map[vault_id]
        if (!vault_config_url)
        {
            console.error(`No vault_id ${vault_id} in vaults_map`, vaults_map)

            store.dispatch(ACTIONS.error_during_loading({ error_stage: "resolve_vault_url", error_type: "404" }))

            return Promise.reject()
        }

        store.dispatch(ACTIONS.update_loading_status({ status: "resolving", stage: "resolve_pdf_file_url" }))

        return fetch(vault_config_url)
    })
    .then(resp => resp.json())
    .then((config: VaultConfig) =>
    {
        store.dispatch(ACTIONS.set_vault_config({ config }))

        const id_to_relative_file_name = config.DO_NOT_EDIT_auto_generated_fields.id_to_relative_file_name
        const { file_id } = state.routing
        const relative_file_path = id_to_relative_file_name[file_id] || state.routing.relative_file_path

        if (!relative_file_path)
        {
            console.error(`No relative_file_path for file_id ${file_id} `, id_to_relative_file_name)

            store.dispatch(ACTIONS.error_during_loading({ error_stage: "resolve_pdf_file_url", error_type: "404" }))

            return Promise.reject()
        }

        store.dispatch(ACTIONS.resolved_relative_file_path({ status: "resolved", relative_file_path }))
    })
}



function get_naming_authority_lookup_url (state: State)
{
    const {
        running_locally,
        override_naming_authority_server_url,
    } = state

    /*
     * Check against local storage for overriding vault config.
     * If found, use that config, otherwise look to central server for config.
     */
    const naming_authority_lookup_url = override_naming_authority_server_url
    || (running_locally
        ? "/local_naming_authority_lookup.json"
        : "https://raw.githubusercontent.com/centerofci/anot8/master/anot8_org_naming_authority_lookup.json")

    return naming_authority_lookup_url
}
