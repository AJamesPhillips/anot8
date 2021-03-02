import json
import os
import urllib.parse

from common import project_root_dir_path, config_dir_path, check_for_required_attributes, standardise_path



def get_vault_config_pointers ():
    config_pointer_file_names = os.listdir(config_dir_path)

    vault_config_pointers = []

    for name in config_pointer_file_names:
        file_path = config_dir_path + name

        should_process = os.path.isfile(file_path) and name.endswith(".json")
        if not should_process:
            continue

        with open(file_path, "r", encoding="utf8") as f:
            original_vault_config_pointer = json.load(f)


        result = check_vault_config_pointer(original_vault_config_pointer, file_path)
        if not result[0]:
            print(original_vault_config_pointer)
            # TODO, handle this gracefully whilst providing user with error message containing
            # missing / incorrect property and location of vault config pointer file
            raise Exception(result[1])


        local_vault_id = name.replace(".json", "")
        local_vault_id = urllib.parse.quote_plus(local_vault_id).replace("/", "__")

        root_path = standardise_path(original_vault_config_pointer["root_path"])
        if not root_path.startswith("/"):
            root_path = project_root_dir_path + root_path


        vault_config_pointer = {
            "local_vault_id": local_vault_id,
            "root_path": root_path,
        }
        vault_config_pointers.append(vault_config_pointer)

    return vault_config_pointers



def check_vault_config_pointer (vault_config_pointer, vault_config_pointer_path):
    required_attributes = [
        ["root_path", str],
    ]

    result = check_for_required_attributes(vault_config_pointer, required_attributes)
    if not result[0]:
        return result

    local_vault_id = vault_config_pointer.get("local_vault_id", None)
    if local_vault_id is not None:
        print("Do not need local_vault_id value in vault config at: \"{}\"".format(vault_config_pointer_path))

    return [True, None]
