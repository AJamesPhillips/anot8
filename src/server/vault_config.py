import json
import os
import urllib.parse

from common import project_root_dir_path, config_dir_path, standardise_path
from anot8_vault_config import upsert_anot8_vault_config
from id_mappings import update_file_perma_ids_mapping
from vault_config_pointers import get_vault_config_pointers



def upsert_anot8_config_and_perma_id_mappings ():
    for vault_config in get_vault_configs_by_id().values():
        update_file_perma_ids_mapping(vault_config)



def get_vault_configs_by_id (use_authorised_vault_id=False):
    vault_config_pointers = get_vault_config_pointers()

    vault_configs_by_id = dict()

    for vault_config_pointer in vault_config_pointers:
        vault_config = upsert_anot8_vault_config(vault_config_pointer)

        standardise_paths(vault_config)
        check_directories(vault_config)
        add_all_directories(vault_config)

        if use_authorised_vault_id:
            if perma_links_available(vault_config):
                authorised_vault_id = vault_config["authorised_vault_id"]
                vault_configs_by_id[authorised_vault_id] = vault_config
        else:
            local_vault_id = vault_config["local_vault_id"]
            vault_configs_by_id[local_vault_id] = vault_config

    return vault_configs_by_id



def perma_links_available (vault_config):
    return vault_config["naming_authority"] and vault_config["authorised_vault_id"]



def get_vault_config_by_id (vault_id):
    vault_configs_by_id = get_vault_configs_by_id()
    vault_config = vault_configs_by_id.get(vault_id, None)

    if vault_config is None:
        vault_configs_by_authorised_id = get_vault_configs_by_id(use_authorised_vault_id=True)
        vault_config = vault_configs_by_authorised_id.get(vault_id, None)

    return vault_config



def get_vault_config_naming_authorities ():
    vault_configs_by_id = get_vault_configs_by_id()
    naming_authorities = []

    # Always allow local access
    naming_authorities.append("-1")

    for vault_config in vault_configs_by_id.values():
        naming_authority = vault_config["naming_authority"] or "-1"
        naming_authorities.append(naming_authority)

    unique_naming_authorities = list(set(naming_authorities))
    return unique_naming_authorities



def standardise_paths (vault_config):
    vault_config["root_path"] = standardise_path(vault_config["root_path"])
    vault_config["publish_root_path"] = standardise_path(vault_config["publish_root_path"])

    for (i, directory) in enumerate(vault_config["directories"]):
        vault_config["directories"][i] = standardise_path(directory)



def check_directories (vault_config):
    directories = vault_config["directories"]
    root_path = vault_config["root_path"]

    directories = filter(None, directories)

    existing_directories = []

    for directory in directories:
        if os.path.isdir(root_path + directory):
            existing_directories.append(directory)
        else:
            cwd = os.getcwd()
            print("From CWD: {} Directory does not exist: {}".format(cwd, root_path + directory))

    vault_config["directories"] = existing_directories



def add_all_directories (vault_config):
    directories = vault_config["directories"]
    root_path = vault_config["root_path"]

    all_directories = []

    for directory in directories:
        all_directories.append(directory)
        all_directories += get_sub_directories(root_path, directory)

    vault_config["all_directories"] = all_directories



def get_sub_directories (root_path, path):
    sub_directories = []

    file_names = sorted(os.listdir(root_path + path))
    for sub_path in file_names:
        sub_directory = path + sub_path + "/"
        if os.path.isdir(root_path + sub_directory):
            sub_directories.append(sub_directory)
            sub_directories += get_sub_directories(root_path, sub_directory)

    return sub_directories
