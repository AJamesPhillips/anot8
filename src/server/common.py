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


# def calculate_common_labels (vault_name):
#     common_labels = dict()

#     with open(vault_labels_config_path(vault_name), "r") as f:
#         labels_csv = csv.reader(f, delimiter=",")
#         for (i, values) in enumerate(labels_csv):
#             try:
#                 label_id = int(values[0])
#             except Exception as e:
#                 raise Exception("Invalid label id: \"{}\" on row: {}".format(values[0], i))

#             label_text = values[1]

#             if label_id in common_labels:
#                 raise Exception("Common labels has duplicate id: {} for label text: \"{}\" and \"{}\"".format(label_id, common_labels[label_id], label_text))

#             common_labels[label_id] = label_text

#     return common_labels

# def ensure_consistent_labels(meta_data, force_update, relative_file_path):
#     for annotation in meta_data["annotations"]:

#         if "deleted" in annotation and annotation["deleted"]:
#             continue

#         for label in annotation["labels"]:

#             label_id = label["id"]
#             common_label_text = common_labels.get(label_id, None)

#             msg = "label id: {label_id} text: \"{original_label_text}\" in annotation {annotation_id} of file \"{relative_file_path}\"".format(
#                 label_id=label_id,
#                 original_label_text=label["text"],
#                 annotation_id=annotation["id"],
#                 relative_file_path=relative_file_path,
#             )

#             if label_id not in common_labels:
#                 if force_update:
#                     raise Exception("TODO: Add {msg} to common labels".format(msg=msg))
#                     # TODO
#                     # common_labels[label_id] = label["text"]
#                     # Save to file
#                 else:
#                     raise Exception("{msg} not in common labels.csv".format(msg=msg))

#             elif label["text"] != common_label_text:
#                 if force_update:
#                     label["text"] = common_label_text
#                     print("Updating text of {msg} to common label text: \"{common_label_text}\"".format(
#                         msg=msg,
#                         common_label_text=common_label_text,
#                     ))
#                 else:
#                     raise Exception("Mismatch with common label text of \"{common_label_text}\" with {msg}".format(
#                         common_label_text=common_label_text,
#                         msg=msg,
#                     ))

#     return meta_data
