import json
import os

from common import config_dir_path


def get_vault_names ():
    vault_names = os.listdir(config_dir_path)

    filtered_vault_names = []

    for name in vault_names:
        if os.path.isfile(config_dir_path + name) and name.endswith(".json"):
            vault_name = name.replace(".json", "")
            filtered_vault_names.append(vault_name)

    return filtered_vault_names


def get_vault_configs ():
    vault_names = get_vault_names()

    vault_configs = dict()

    for vault_name in vault_names:
        with open(config_dir_path + vault_name + ".json") as f:
            vault_config = json.load(f)

        vault_configs[vault_name] = vault_config
        result = check_vault_config(vault_config)
        if not result[0]:
            raise Exception(result[1])

        standardise_paths(vault_config)
        check_directories(vault_config)
        add_all_sub_directories(vault_config)
        vault_config["vault_name"] = vault_name

    return vault_configs


def get_vault_configs_by_id ():
    vault_configs = get_vault_configs()

    mapping = {}

    for vault_config in vault_configs.values():
        vault_id = vault_config["vault_id"]

        if vault_id in mapping:
            raise Exception("Duplicate vault ids: {} ".format(vault_id))

        mapping[vault_id] = vault_config

    return mapping


def get_vault_config_by_id (vault_id):
    vault_id = int(vault_id)
    vault_configs_by_id = get_vault_configs_by_id()
    vault_config = vault_configs_by_id.get(vault_id, None)
    return vault_config


def check_vault_config (vault_config):
    required_attributes = [
        ["vault_id", int],
        ["root_path", str],
        ["publish_root_path", str],
        ["directories", list, str],
        ["labels", list, str],
        ["schema_version", int],
    ]

    for required_attribute in required_attributes:
        required_attribute_name = required_attribute[0]

        if required_attribute_name not in vault_config:
            return [False, "Missing required attribute: {}".format(required_attribute_name)]

        result = check_types(vault_config, required_attribute)
        if not result[0]:
            return result

    return [True, None]


def check_types (obj, attribute):
    attribute_name = attribute[0]
    attribute_type = attribute[1]
    value = obj[attribute_name]

    if not isinstance(value, attribute_type):
        return [False, "Attribute: {} of type {} but require {}".format(attribute_name, type(value).__name__, attribute_type.__name__)]

    if attribute_type == list:
        sub_attribute_type = attribute[2]
        for sub_value in value:
            if not isinstance(sub_value, sub_attribute_type):
                return [False, "Sub attribute of: {} \"{}\" of type {} but require {}".format(attribute_name, sub_value, type(sub_value).__name__, sub_attribute_type.__name__)]

    return [True, None]


def standardise_paths (vault_config):
    vault_config["root_path"] = standardise_path(vault_config["root_path"])

    for (i, directory) in enumerate(vault_config["directories"]):
        vault_config["directories"][i] = standardise_path(directory)

    # if "publish_root_path" in vault_config:
    #     vault_config["publish_root_path"] = standardise_path(vault_config["publish_root_path"])


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


def add_all_sub_directories (vault_config):
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

