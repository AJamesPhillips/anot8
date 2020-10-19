import json
import os

from common import config_dir_path, anot8_org_config_dir_path, print_warning
from vault_config import get_vault_configs
from annotations import has_annotations_file, get_annotation_relative_file_paths_in_vault


def get_naming_authority ():
    file_path = config_dir_path + "naming_authority.txt"

    if not os.path.isfile(file_path):
        return None

    with open(file_path, "r") as f:
        return f.read().strip()


def get_id_map_file_path (vault_config):
    id_mappings_file_name = config_dir_path + vault_config["vault_name"] + ".id_mappings"
    return id_mappings_file_name


def get_id_map (vault_config):
    id_mappings_file_name = get_id_map_file_path(vault_config)

    if not os.path.isfile(id_mappings_file_name):
        return None

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

    if not id_value:
        id_value = upsert_file_perma_id_mapping(vault_config, data_file_relative_file_path + ".annotations")

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


def upsert_file_perma_ids_mapping_for_all_vaults ():
    vault_configs = get_vault_configs()

    for vault_config in vault_configs.values():
        upsert_file_perma_ids_mapping(vault_config)


def upsert_file_perma_ids_mapping (vault_config):
    mappings = get_id_map(vault_config)

    if not mappings:
        mappings = dict(
            next_id=1,
            id_to_relative_file_name=dict(),
            schema_version=1,
        )

    id_to_relative_file_name = mappings["id_to_relative_file_name"]
    next_id = mappings["next_id"]

    relative_file_names_already_mapped = set(id_to_relative_file_name.values())

    file_paths = get_annotation_relative_file_paths_in_vault(vault_config)
    for annotations_relative_file_path in file_paths:
        data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

        if data_file_relative_file_path in relative_file_names_already_mapped:
            continue

        id_to_relative_file_name[next_id] = data_file_relative_file_path
        next_id += 1

    id_mappings_file_name = get_id_map_file_path(vault_config)
    with open(id_mappings_file_name, "w") as f:
        mapping_file_contents = dict(
            next_id=next_id,
            id_to_relative_file_name=id_to_relative_file_name,
            schema_version=1,
        )
        json.dump(mapping_file_contents, f, indent=0, ensure_ascii=False)


def upsert_file_perma_id_mapping (vault_config, annotations_relative_file_path):
    data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

    mappings = get_id_map(vault_config)

    if data_file_relative_file_path in mappings["id_to_relative_file_name"].values():
        return

    new_id = mappings["next_id"]
    mappings["next_id"] += 1
    mappings["id_to_relative_file_name"][new_id] = data_file_relative_file_path

    id_mappings_file_name = get_id_map_file_path(vault_config)
    with open(id_mappings_file_name, "w") as f:
        json.dump(mappings, f, indent=0, ensure_ascii=False)

    return new_id
