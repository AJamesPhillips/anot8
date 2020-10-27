import json
import os

from common import print_warning
from annotations import has_annotations_file, get_annotation_relative_file_paths_in_vault
from anot8_org_config import write_anot8_org_vault_config


def get_naming_authority (vault_config):
    return vault_config["naming_authority"] or "-1"


def get_id_to_relative_file_name_map (vault_config):
    id_to_relative_file_name = vault_config["DO_NOT_EDIT_auto_generated_fields"]["id_to_relative_file_name"]

    return id_to_relative_file_name


def get_next_id (vault_config):
    next_id = vault_config["DO_NOT_EDIT_auto_generated_fields"]["next_id"]

    return next_id


def get_id_for_data_file_relative_file_path (vault_config, data_file_relative_file_path):
    id_to_relative_file_name = get_id_to_relative_file_name_map(vault_config)
    id_value = None

    for (id_v, file_path) in id_to_relative_file_name.items():
        if file_path == data_file_relative_file_path:
            id_value = id_v
            break

    if not id_value:
        id_value = upsert_file_perma_id_mapping(vault_config, data_file_relative_file_path + ".annotations")

    return id_value or "-1"


def get_data_file_relative_file_path_for_id (vault_config, file_id):
    id_to_relative_file_name = get_id_to_relative_file_name_map(vault_config)
    file_id = str(file_id)
    data_file_relative_file_path = id_to_relative_file_name.get(file_id, None)

    return data_file_relative_file_path


def perma_path (**kwargs):
    return "/r/{naming_authority}.{vault_id}/{file_id}".format(**kwargs)


def local_url (vault_config, data_file_relative_file_path):
    naming_authority = get_naming_authority(vault_config)
    vault_id = vault_config["vault_id"]
    file_id = get_id_for_data_file_relative_file_path(vault_config, data_file_relative_file_path)

    url = perma_path(naming_authority=naming_authority, vault_id=vault_id, file_id=file_id)

    if file_id == "-1":
        url += "?relative_file_path={relative_file_path}".format(relative_file_path=data_file_relative_file_path)

    return url


def perma_url (vault_config, data_file_relative_file_path):
    naming_authority = get_naming_authority(vault_config)

    if not naming_authority:
        print_warning("No naming_authority set")
        return False

    root_path = vault_config["root_path"]
    if not has_annotations_file(root_path, data_file_relative_file_path):
        return False

    vault_id = vault_config["vault_id"]
    file_id = get_id_for_data_file_relative_file_path(vault_config, data_file_relative_file_path)

    if file_id == "-1":
        return False

    return "https://anot8.org" + perma_path(naming_authority=naming_authority, vault_id=vault_id, file_id=file_id)


def update_file_perma_ids_mapping (vault_config):
    id_to_relative_file_name = get_id_to_relative_file_name_map(vault_config)
    next_id = get_next_id(vault_config)

    relative_file_names_already_mapped = set(id_to_relative_file_name.values())

    file_paths = get_annotation_relative_file_paths_in_vault(vault_config)
    for annotations_relative_file_path in file_paths:
        data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

        if data_file_relative_file_path in relative_file_names_already_mapped:
            continue

        id_to_relative_file_name[next_id] = data_file_relative_file_path
        next_id += 1

    vault_config["DO_NOT_EDIT_auto_generated_fields"]["id_to_relative_file_name"] = id_to_relative_file_name
    vault_config["DO_NOT_EDIT_auto_generated_fields"]["next_id"] = next_id

    write_anot8_org_vault_config(vault_config)


def upsert_file_perma_id_mapping (vault_config, annotations_relative_file_path):
    data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

    id_to_relative_file_name = get_id_to_relative_file_name_map(vault_config)

    if data_file_relative_file_path in id_to_relative_file_name.values():
        return

    new_id = get_next_id(vault_config)
    next_id = new_id + 1
    id_to_relative_file_name[new_id] = data_file_relative_file_path

    vault_config["DO_NOT_EDIT_auto_generated_fields"]["id_to_relative_file_name"] = id_to_relative_file_name
    vault_config["DO_NOT_EDIT_auto_generated_fields"]["next_id"] = next_id

    write_anot8_org_vault_config(vault_config)

    return new_id
