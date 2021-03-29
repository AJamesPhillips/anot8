import json
import os

from annotations import has_main_annotations_file, get_annotation_relative_file_paths_in_vault
from anot8_vault_config import write_anot8_vault_config
from common import (annotations_file_path_to_data_file_path, print_warning)



def get_naming_authority (vault_config):
    return vault_config["naming_authority"] or "-1"



def get_id_to_relative_file_name_map (vault_config):
    return vault_config["DO_NOT_EDIT_auto_generated_fields"]["id_to_relative_file_name"]



def get_next_id (vault_config):
    return vault_config["DO_NOT_EDIT_auto_generated_fields"]["next_id"]



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



def get_pathname (**kwargs):
    return "/r/{naming_authority}.{vault_id}/{file_id}".format(**kwargs)



def get_local_url (vault_config, data_file_relative_file_path):
    naming_authority = get_naming_authority(vault_config)
    vault_id = vault_config["authorised_vault_id"] or vault_config["local_vault_id"]
    file_id = get_id_for_data_file_relative_file_path(vault_config, data_file_relative_file_path)

    pathname = get_pathname(naming_authority=naming_authority, vault_id=vault_id, file_id=file_id)

    if file_id == "-1":
        pathname += "?relative_file_path={relative_file_path}".format(relative_file_path=data_file_relative_file_path)

    return pathname



def get_perma_url (vault_config, data_file_relative_file_path):
    naming_authority = get_naming_authority(vault_config)

    if naming_authority == "-1":
        return [False, "naming_authority not yet set in vault config"]

    root_path = vault_config["root_path"]
    if not has_main_annotations_file(root_path, data_file_relative_file_path):
        return [False, "no annotations file"]

    authorised_vault_id = vault_config["authorised_vault_id"]
    if not authorised_vault_id:
        return [False, "authorised_vault_id not yet set in vault config"]

    file_id = get_id_for_data_file_relative_file_path(vault_config, data_file_relative_file_path)
    if file_id == "-1":
        raise Exception("Can not find file id for relative file path: \"{data_file_relative_file_path}\"")

    perma_url = "https://anot8.org" + get_pathname(naming_authority=naming_authority, vault_id=authorised_vault_id, file_id=file_id)
    return [True, perma_url]



def update_file_perma_ids_mapping (vault_config):
    id_to_relative_file_name_map = get_id_to_relative_file_name_map(vault_config)
    next_id = get_next_id(vault_config)

    relative_file_names_already_mapped = set(id_to_relative_file_name_map.values())

    check_mapped_files_exist(vault_config["root_path"], id_to_relative_file_name_map)


    file_paths = get_annotation_relative_file_paths_in_vault(vault_config)["main_annotation_relative_file_paths"]
    for annotations_relative_file_path in file_paths:
        data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

        if data_file_relative_file_path in relative_file_names_already_mapped:
            continue

        id_to_relative_file_name_map[next_id] = data_file_relative_file_path
        next_id += 1

    vault_config["DO_NOT_EDIT_auto_generated_fields"]["id_to_relative_file_name"] = id_to_relative_file_name_map
    vault_config["DO_NOT_EDIT_auto_generated_fields"]["next_id"] = next_id

    write_anot8_vault_config(vault_config)



def check_mapped_files_exist (root_path, id_to_relative_file_name_map):
    broken_file_paths = []

    for data_file_relative_file_path in id_to_relative_file_name_map.values():
        file_path = root_path + data_file_relative_file_path
        file_exists = os.path.isfile(file_path)
        if not file_exists:
            broken_file_paths.append(file_path)
        continue

    if broken_file_paths:
        print_warning("{} broken file paths: {}".format(len(broken_file_paths), "\n".join(broken_file_paths)))



def upsert_file_perma_id_mapping (vault_config, annotations_relative_file_path):
    data_file_relative_file_path = annotations_file_path_to_data_file_path(annotations_relative_file_path)

    id_to_relative_file_name = get_id_to_relative_file_name_map(vault_config)

    if data_file_relative_file_path in id_to_relative_file_name.values():
        return

    new_id = get_next_id(vault_config)
    next_id = new_id + 1
    id_to_relative_file_name[new_id] = data_file_relative_file_path

    vault_config["DO_NOT_EDIT_auto_generated_fields"]["id_to_relative_file_name"] = id_to_relative_file_name
    vault_config["DO_NOT_EDIT_auto_generated_fields"]["next_id"] = next_id

    write_anot8_vault_config(vault_config)

    return new_id
