import json
import os

from common import config_dir_path, check_for_required_attributes
from anot8_org_config import upsert_anot8_vault_config
from id_mappings import update_file_perma_ids_mapping


def upsert_anot8_config_and_perma_id_mappings ():
    for vault_config in get_vault_configs_by_id().values():
        update_file_perma_ids_mapping(vault_config)


def get_vault_configs_by_id ():
    vault_ids = get_vault_ids()

    vault_configs_by_id = dict()

    for vault_id in vault_ids:
        with open(config_dir_path + vault_id + ".json") as f:
            vault_config = json.load(f)

        result = check_vault_config(vault_config)

        if not result[0]:
            raise Exception(result[1])

        vault_config["root_path"] = standardise_path(vault_config["root_path"])
        vault_config["vault_id"] = vault_id

        vault_config = upsert_anot8_vault_config(vault_config)

        standardise_paths(vault_config)
        check_directories(vault_config)
        add_all_directories(vault_config)

        vault_configs_by_id[vault_id] = vault_config

    return vault_configs_by_id


def get_vault_ids ():
    vault_ids = os.listdir(config_dir_path)

    filtered_vault_ids = []

    for name in vault_ids:
        if os.path.isfile(config_dir_path + name) and name.endswith(".json"):
            vault_name = name.replace(".json", "")
            filtered_vault_ids.append(vault_name)

    return filtered_vault_ids


def get_vault_config_by_id (vault_id):
    vault_configs_by_id = get_vault_configs_by_id()
    vault_config = vault_configs_by_id.get(vault_id, None)
    return vault_config


def check_vault_config (vault_config):
    required_attributes = [
        ["vault_name", str],
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

