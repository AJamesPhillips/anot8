import { parse_location_search } from "../utils/location"
import { State } from "./state"




// let url_to_file = undefined
// let url_to_file_annotations = undefined
// let url_to_write_file_annotations = undefined

// let file_meta_data = {annotations: []}
// let file_meta_data_loaded = false
// let common_labels = []

// const promise_data_urls = new Promise((resolve) =>
// {
//     const running_locally = window.location.host !== "anot8.org"

//     /*
//      * check against local storage for overriding vault config.
//      * If found, use that config, otherwise look to central server for config.
//      */
//     let naming_authority_lookup_url = `https://raw.githubusercontent.com/centerofci/anot8/master/anot8_org_naming_authority_lookup.json`
//     const override_naming_authority_server_url = localStorage.getItem("override_naming_authority_server_url")
//     if (running_locally && !override_naming_authority_server_url)
//     {
//         naming_authority_lookup_url = "/local_naming_authority_lookup.json"
//     }
//     else if (override_naming_authority_server_url)
//     {
//         naming_authority_lookup_url = override_naming_authority_server_url
//     }

//     const loading_progress_el = document.getElementById("loading_progress")

//     fetch(naming_authority_lookup_url)
//     .then(resp => resp.json())
//     .then(naming_authority_lookup =>
//     {
//         const vault_lookup_url = naming_authority_lookup[naming_authority]
//         if (!vault_lookup_url)
//         {
//             const msg = `No naming_authority ${naming_authority} in naming_authority_lookup`
//             console.error(msg, naming_authority_lookup)
//             loading_progress_el.innerHTML = `Error: naming authority "${naming_authority}" not found`
//             return
//         }

//         return fetch(vault_lookup_url)
//     })
//     .then(resp => resp.json())
//     .then(vault_lookup =>
//     {
//         const config_path = vault_lookup[vault_id]
//         if (!config_path)
//         {
//             console.error(`No vault_id ${vault_id} in vault_lookup`, vault_lookup)
//             loading_progress_el.innerHTML = `Error: vault id "${vault_id}" not found`
//             return
//         }

//         return fetch(config_path)
//     })
//     .then(resp => resp.json())
//     .then(config =>
//     {
//         common_labels = config.labels
//         const id_to_relative_file_name = config.DO_NOT_EDIT_auto_generated_fields.id_to_relative_file_name

//         const vars = parse_location_search()

//         const relative_file_path = id_to_relative_file_name[file_id] || vars.relative_file_path
//         if (!relative_file_path)
//         {
//             console.error(`No relative_file_path for file_id ${file_id} `, id_to_relative_file_name)
//             loading_progress_el.innerHTML = `Error: No relative file path found for file id "${file_id}"`
//             return
//         }

//         if (running_locally)
//         {
//             url_to_file = `/serve_file/${vault_id}?relative_file_path=${relative_file_path}`
//             url_to_file_annotations = `/serve_file/${vault_id}?relative_file_path=${relative_file_path}.annotations`
//             url_to_write_file_annotations = `/annotations/${vault_id}?relative_file_path=${relative_file_path}.annotations`
//         }
//         else
//         {
//             const publish_root_path = config.publish_root_path

//             url_to_file = `${publish_root_path}${relative_file_path}`
//             url_to_file_annotations = `${publish_root_path}${relative_file_path}.annotations`
//             url_to_write_file_annotations = ``
//         }

//         resolve({
//             url_to_file,
//             url_to_file_annotations,
//             url_to_write_file_annotations,
//         })
//     })

// })