import { fetch_files } from "./fetch_files"
import { resolve_relative_file_path } from "./resolve_relative_file_path"



export function load_files ()
{
    return resolve_relative_file_path()
    .then(() => fetch_files())
}
