


export interface NamingAuthorityConfigURLLookup
{
    [naming_authority_name: string]: string // url to naming_authority vaults config map
}


export interface VaultsConfigURLLookup
{
    [vault_id: string]: string // url to vault config
}


export interface VaultConfig
{
    naming_authority: string
    authorised_vault_id: string
    publish_root_path: string
    directories: string[]
    labels: string[]
    DO_NOT_EDIT_auto_generated_fields: {
        schema_version: number
        id_to_relative_file_name: { [file_id: string]: string } // file id to relative file path
        // next_id: number
    }
}
