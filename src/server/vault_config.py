import json
import os
import urllib.parse

from common import project_root_dir_path, config_dir_path, check_for_required_attributes
from anot8_vault_config import upsert_anot8_vault_config
from id_mappings import update_file_perma_ids_mapping


def upsert_anot8_config_and_perma_id_mappings ():
    for vault_config in get_vault_configs_by_id().values():
        update_file_perma_ids_mapping(vault_config)


def get_vault_configs_by_id (use_alternative_id=False):
    local_vault_configs = get_local_vault_configs()

    vault_configs_by_id = dict()

    for local_vault_config in local_vault_configs:
        result = check_local_vault_config(local_vault_config)
        if not result[0]:
            print(local_vault_config)
            raise Exception(result[1])

        local_vault_id = local_vault_config["local_vault_id"]
        local_vault_id = urllib.parse.quote_plus(local_vault_id)
        local_vault_config["local_vault_id"] = local_vault_id

        root_path = standardise_path(local_vault_config["root_path"])
        normalised_root_path = root_path if root_path.startswith("/") else (project_root_dir_path + root_path)

        local_vault_config["root_path"] = normalised_root_path

        vault_config = upsert_anot8_vault_config(local_vault_config)

        standardise_paths(vault_config)
        check_directories(vault_config)
        add_all_directories(vault_config)

        if use_alternative_id:
            if local_similar_perma_links_available(vault_config):
                alternative_local_vault_id = vault_config["alternative_local_vault_id"]
                vault_configs_by_id[alternative_local_vault_id] = vault_config
        else:
            vault_configs_by_id[local_vault_id] = vault_config

    return vault_configs_by_id


# TODO: the names `local_similar_perma_links_available` and `alternative_local_vault_id` are not right yet
def local_similar_perma_links_available (vault_config):
    return vault_config["naming_authority"] and vault_config["alternative_local_vault_id"]


def get_local_vault_configs ():
    local_vault_configs = os.listdir(config_dir_path)

    filtered_local_vault_configs = []

    for name in local_vault_configs:
        file_path = config_dir_path + name
        if os.path.isfile(file_path) and name.endswith(".json"):
            with open(file_path, "r") as f:
                local_vault_config = json.load(f)
                local_vault_config["local_vault_name"] = name.replace(".json", "")
                filtered_local_vault_configs.append(local_vault_config)

    return filtered_local_vault_configs


def get_vault_config_by_id (vault_id):
    vault_configs_by_id = get_vault_configs_by_id()
    vault_config = vault_configs_by_id.get(vault_id, None)

    if vault_config is None:
        vault_configs_by_id = get_vault_configs_by_id(use_alternative_id=True)
        vault_config = vault_configs_by_id.get(vault_id, None)

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


def check_local_vault_config (vault_config):
    required_attributes = [
        ["local_vault_id", str],
        ["local_vault_name", str],
        ["root_path", str],
    ]

    return check_for_required_attributes(vault_config, required_attributes)


def standardise_paths (vault_config):
    vault_config["root_path"] = standardise_path(vault_config["root_path"])
    vault_config["publish_root_path"] = standardise_path(vault_config["publish_root_path"])

    for (i, directory) in enumerate(vault_config["directories"]):
        vault_config["directories"][i] = standardise_path(directory)


def standardise_path (path):
    path = path.strip()

    if not path:
        return ""

    if not path.endswith("/"):
        path += "/"

    return path


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

