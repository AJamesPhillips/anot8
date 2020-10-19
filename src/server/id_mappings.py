import json
import os

from common import config_dir_path, anot8_org_config_dir_path, print_warning
from vault_config import get_vault_configs
from annotations import has_annotations_file


def get_naming_authority ():
    file_path = config_dir_path + "naming_authority.txt"

    if not os.path.isfile(file_path):
        return None

    with open(file_path, "r") as f:
        return f.read().strip()


def get_id_map (vault_config):
    id_mappings_file_name = config_dir_path + vault_config["vault_name"] + ".id_mappings"

    with open(id_mappings_file_name, "r") as f:
        mappings = json.load(f)

    return mappings


def get_id_for_data_file_relative_file_path (vault_config, data_file_relative_file_path):
    mappings = get_id_map(vault_config)
    id_value = None

    for (id_v, file_path) in mappings["id_to_relative_file_name"].items():
        if file_path == data_file_relative_file_path:
            id_value = id_v
            break

    return id_value


def get_data_file_relative_file_path_for_id (vault_config, file_id):
    mappings = get_id_map(vault_config)
    file_id = str(file_id)
    data_file_relative_file_path = mappings["id_to_relative_file_name"].get(file_id, None)

    return data_file_relative_file_path


def perma_path (**kwargs):
    return "/r/{naming_authority}.{vault_id}/{file_id}".format(**kwargs)


def local_url (vault_config, data_file_relative_file_path):
    naming_authority = get_naming_authority() or -1

    vault_id = vault_config["vault_id"]
    file_id = get_id_for_data_file_relative_file_path(vault_config, data_file_relative_file_path) or -1

    url = perma_path(naming_authority=naming_authority, vault_id=vault_id, file_id=file_id)

    if file_id == -1:
        url += "?relative_file_path={relative_file_path}".format(relative_file_path=data_file_relative_file_path)

    return url


def perma_url (vault_config, data_file_relative_file_path):
    naming_authority = get_naming_authority()

    if not naming_authority:
        print_warning("No naming_authority set")
        return False

    root_path = vault_config["root_path"]
    if not has_annotations_file(root_path, data_file_relative_file_path):
        return False

    vault_id = vault_config["vault_id"]
    file_id = get_id_for_data_file_relative_file_path(vault_config, data_file_relative_file_path)

    if not file_id:
        return False

    return "https://anot8.org" + perma_path(naming_authority=naming_authority, vault_id=vault_id, file_id=file_id)


def upsert_perma_id_mappings ():
    vault_configs = get_vault_configs()

    for vault_config in vault_configs.values():
        id_mappings_file_name = config_dir_path + vault_config["vault_name"] + ".id_mappings"
        if not os.path.isfile(id_mappings_file_name):
            with open(id_mappings_file_name, "w") as f:
                mapping_file_contents = dict(
                    id_to_relative_file_name=dict(),
                    # relative_file_name_to_id=dict(),
                    schema_version=1,
                )
                json.dump(mapping_file_contents, f, indent=0, ensure_ascii=False)

        else:
            mappings = get_id_map(vault_config)
            check_mappings(vault_config, mappings)


def check_mappings (vault_config, mappings):
    # check files are unique and exist
    existing_file_paths = set()
    duplicate_file_paths = set()
    missing_files = set()

    root_path = vault_config["root_path"]

    for data_file_relative_file_path in mappings["id_to_relative_file_name"].values():
        if data_file_relative_file_path in existing_file_paths:
            print("Duplicate file_path: " + data_file_relative_file_path)
            duplicate_file_paths.add(data_file_relative_file_path)
        existing_file_paths.add(data_file_relative_file_path)

        if not os.path.isfile(root_path + data_file_relative_file_path):
            missing_files.add(data_file_relative_file_path)
            print("Missing file: " + data_file_relative_file_path)

        if not os.path.isfile(root_path + data_file_relative_file_path + ".annotations"):
            missing_files.add(data_file_relative_file_path + ".annotations")
            print("Missing file: " + data_file_relative_file_path + ".annotations")

    if duplicate_file_paths:
        msg = "{} duplicate file_paths in id_mappings".format(len(duplicate_file_paths))
        print_warning(msg)
        raise Exception(msg)

    if missing_files:
        msg = "{} missing files in id_mappings".format(len(missing_files))
        print_warning(msg)

#     relative_file_name_to_id = get_file_name_to_id_map(id_to_relative_file_name)
#     if mappings["relative_file_name_to_id"] != relative_file_name_to_id:
#         msg = "Mappings file was corrupted, restoring"
#         print_warning(msg)
#         mappings["relative_file_name_to_id"] = relative_file_name_to_id


# def get_file_name_to_id_map (id_to_relative_file_name):
#     relative_file_name_to_id = dict()
#     for (id_value, path) in id_to_relative_file_name.items():
#         relative_file_name_to_id[path] = id_value

#     return relative_file_name_to_id


def upsert_file_perma_id_mapping (vault_config, annotations_relative_file_path):
    data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

    mappings = get_id_map(vault_config)

    if data_file_relative_file_path in mappings["id_to_relative_file_name"].values():
        return

    ids = list(map(int, mappings["id_to_relative_file_name"].keys()))
    next_id = (max(ids) if ids else 0) + 1
    mappings["id_to_relative_file_name"][next_id] = data_file_relative_file_path
    # mappings["relative_file_name_to_id"] = get_file_name_to_id_map(mappings["id_to_relative_file_name"])

    id_mappings_file_name = config_dir_path + vault_config["vault_name"] + ".id_mappings"
    with open(id_mappings_file_name, "w") as f:
        json.dump(mappings, f, indent=0, ensure_ascii=False)
