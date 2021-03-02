import csv
import json
import os
import sys


dir_path = os.path.dirname(os.path.realpath(__file__))
config_dir_path = dir_path + "/../../config/"
project_root_dir_path = dir_path + "/../../"



def supported_relative_file_path (vault_config, relative_file_path):
    supported_file_type = False
    if relative_file_path and relative_file_path.endswith(".pdf"):
        supported_file_type = True

    is_annotations = bool(relative_file_path) and relative_file_path.endswith(".pdf.annotations")
    if is_annotations:
        supported_file_type = True

    parts = relative_file_path.split("/")
    directory = "/".join(parts[0: -1]) + "/"

    supported_directory = directory in vault_config["all_directories"]

    root_path = vault_config["root_path"]
    full_path = root_path + relative_file_path

    file_exists = os.path.isfile(full_path)

    supported = supported_file_type and supported_directory and file_exists

    return dict(
        supported=supported,
        is_annotations=is_annotations,
        supported_file_type=supported_file_type,
        supported_directory=supported_directory,
        file_exists=file_exists,
    )



def print_warning (msg):
    print("\n!!!!!!!!!!!!!\nWARNING: {msg} \n!!!!!!!!!!!!!\n".format(msg=msg))



def check_for_required_attributes (obj, required_attributes):
    for required_attribute in required_attributes:
        required_attribute_name = required_attribute[0]

        if required_attribute_name not in obj:
            return [False, "Missing required attribute: {}".format(required_attribute_name)]

        result = check_types(obj, required_attribute)
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



def standardise_path (path):
    path = path.strip()

    if not path:
        return ""

    if not path.endswith("/"):
        path += "/"

    return path
