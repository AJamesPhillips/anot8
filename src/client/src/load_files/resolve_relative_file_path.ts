import { ACTIONS } from "../state/actions"
import { NamingAuthorityConfigURLLookup, VaultsConfigURLLookup, VaultConfig } from "../state/interfaces"
import { LoadingStage, LoadingStatus, State } from "../state/state"
import { get_store } from "../state/store"



export async function resolve_relative_file_path ()
{
    const store = get_store()
    const state = store.getState()
    const { naming_authority, vault_id, file_id, relative_file_path } = state.routing
    const naming_authority_lookup_url = get_naming_authority_lookup_url(state)


    store.dispatch(ACTIONS.loading.update_loading_status({
        status: LoadingStatus.resolving,
        stage: LoadingStage.resolve_naming_authority_url,
    }))


    const resp = await fetch(naming_authority_lookup_url)
    const naming_authority_lookup: NamingAuthorityConfigURLLookup = await resp.json()

    const vaults_map_url = naming_authority_lookup[naming_authority]
    if (!vaults_map_url)
    {
        const msg = `No naming_authority ${naming_authority} in naming_authority_lookup`
        console.error(msg, naming_authority_lookup)

        store.dispatch(ACTIONS.loading.error_during_loading({
            error_stage: LoadingStage.resolve_naming_authority_url,
            error_type: "404",
        }))

        return Promise.reject()
    }

    store.dispatch(ACTIONS.loading.update_loading_status({
        status: LoadingStatus.resolving,
        stage: LoadingStage.resolve_vault_url,
    }))

    const resp2 = await fetch(vaults_map_url)
    const vaults_map: VaultsConfigURLLookup = await resp2.json()

    const vault_config_url = vaults_map[vault_id]
    if (!vault_config_url)
    {
        console.error(`No vault_id ${vault_id} in vaults_map`, vaults_map)

        store.dispatch(ACTIONS.loading.error_during_loading({
            error_stage: LoadingStage.resolve_vault_url,
            error_type: "404",
        }))

        return Promise.reject()
    }

    store.dispatch(ACTIONS.loading.update_loading_status({
        status: LoadingStatus.resolving,
        stage: LoadingStage.resolve_pdf_file_url,
    }))

    const resp3 = await fetch(vault_config_url)
    const config: VaultConfig = await resp3.json()
    store.dispatch(ACTIONS.loading.set_vault_config({ config }))

    const id_to_relative_file_name = config.DO_NOT_EDIT_auto_generated_fields.id_to_relative_file_name
    const resolved_relative_file_path = id_to_relative_file_name[file_id] || relative_file_path

    if (!resolved_relative_file_path)
    {
        console.error(`No resolved_relative_file_path for file_id ${file_id} `, id_to_relative_file_name)

        store.dispatch(ACTIONS.loading.error_during_loading({
            error_stage: LoadingStage.resolve_pdf_file_url,
            error_type: "404",
        }))

        return Promise.reject()
    }

    store.dispatch(ACTIONS.loading.resolved_relative_file_path({ status: "resolved", resolved_relative_file_path }))
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
