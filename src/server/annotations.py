import hashlib
import json
import os
import re

from common import (
    annotations_file_path_to_data_file_path,
    get_user_name_from_annotations_file_path,
    print_warning,
)



def has_main_annotations_file (root_path, data_file_relative_file_path):
    return os.path.isfile(root_path + data_file_relative_file_path + ".annotations")



def upsert_meta_data_annotations_file (vault_config, annotations_relative_file_path, override_user_name=""):
    root_path = vault_config["root_path"]

    data_file_relative_file_path = annotations_file_path_to_data_file_path(annotations_relative_file_path)
    main_annotations_relative_file_path = data_file_relative_file_path + ".annotations"

    safe_user_name = get_user_name_from_annotations_file_path(annotations_relative_file_path)
    if override_user_name and get_safe_user_name(override_user_name) == safe_user_name:
        user_name = override_user_name
    else:
        user_name = safe_user_name

    meta_data = ensure_annotations_file(root_path, main_annotations_relative_file_path, user_name)

    if user_name:
        meta_data = ensure_annotations_file(root_path, annotations_relative_file_path, None)

    return meta_data



def ensure_annotations_file (root_path, annotations_relative_file_path, user_name):
    data_file_relative_file_path = annotations_file_path_to_data_file_path(annotations_relative_file_path)

    annotations_file_path = root_path + annotations_relative_file_path
    data_file_path = root_path + data_file_relative_file_path


    # Remember to also edit this value in the client app
    current_schema_version = SUPPORTED_SCHEMA_VERSION = 6

    if os.path.isfile(annotations_file_path):
        with open(annotations_file_path, "r", encoding="utf8") as f:
            meta_data = json.load(f)

    else:
        with open(data_file_path, "rb") as f:
            file_sha1_hash = sha1_hash_file(f)

        meta_data = {
            "file_sha1_hash": file_sha1_hash,
            "annotation_user_names": [],
            "annotations": [],
            "comments": [],
            "schema_version": current_schema_version,
        }

    meta_data = upgrade_meta_data(meta_data, current_schema_version)

    meta_data = ensure_user_name_in_annotation_user_names(meta_data, user_name)

    write_annotations_file(annotations_file_path, meta_data)

    return meta_data



def ensure_user_name_in_annotation_user_names (meta_data, user_name):
    if not user_name:
        return meta_data

    existing_safe_user_names = set(map(get_safe_user_name, meta_data["annotation_user_names"]))

    if get_safe_user_name(user_name) not in existing_safe_user_names:
        meta_data["annotation_user_names"].append(user_name)

    return meta_data



def get_safe_user_name (user_name):
    return re.sub(r"[^a-z0-9_]", "_", user_name.strip().lower())



def write_annotations_file (annotations_file_path, data):
    with open(annotations_file_path, "w", encoding="utf8") as f:
        json.dump(data, f, indent=0, ensure_ascii=False)



# Adapted from: https://stackoverflow.com/a/22058673/539490
def sha1_hash_file (file_descriptor):
    # BUF_SIZE is totally arbitrary, change for your app!
    BUF_SIZE = 65536  # lets read stuff in 64kb chunks!

    sha1 = hashlib.sha1()

    while True:
        data = file_descriptor.read(BUF_SIZE)
        if not data:
            break
        sha1.update(data)

    return sha1.hexdigest()



def upgrade_meta_data (meta_data, current_schema_version):
    if "version" in meta_data:
        meta_data["schema_version"] = meta_data["version"]
        del meta_data["version"]

    if meta_data["schema_version"] == current_schema_version:
        return meta_data

    if "relative_file_path" in meta_data:
        del meta_data["relative_file_path"]

    if meta_data["schema_version"] == 4:
        for annotation in meta_data["annotations"]:
            if "deleted" in annotation:
                continue

            for (i, label) in enumerate(annotation["labels"]):
                annotation["labels"][i] = label["text"]

        meta_data["schema_version"] = 5


    if meta_data["schema_version"] == 5:
        meta_data["annotation_user_names"] = []
        meta_data["schema_version"] = 6


    return meta_data



def upgrade_all_annotations (vault_configs):
    # print("+Ensure all annotations are upgraded")

    for vault_config in vault_configs:
        file_paths = get_annotation_relative_file_paths_in_vault(vault_config)

        for annotations_relative_file_path in file_paths["main_annotation_relative_file_paths"]:
            upsert_meta_data_annotations_file(vault_config, annotations_relative_file_path)
        for annotations_relative_file_path in file_paths["user_specific_annotation_relative_file_paths"]:
            upsert_meta_data_annotations_file(vault_config, annotations_relative_file_path)

    print("Upgraded all annotations")
    # print("-Ensure all annotations are upgraded")



def get_annotation_relative_file_paths_in_vault (vault_config):
    root_path = vault_config["root_path"]
    all_directories = vault_config["all_directories"]

    main_annotation_relative_file_paths = []
    user_specific_annotation_relative_file_paths = []
    broken_annotation_file_paths = []

    for directory in all_directories:
        dir_path = root_path + directory
        file_names = os.listdir(dir_path)
        for file_name in file_names:

            is_not_a_file = not os.path.isfile(dir_path + file_name)
            if is_not_a_file:
                continue

            is_not_annotations_file = not file_name.endswith(".annotations")
            if is_not_annotations_file:
                continue

            # check corresponding file exists
            data_file_name = annotations_file_path_to_data_file_path(file_name)
            absolute_data_file_path = dir_path + data_file_name
            if os.path.isfile(absolute_data_file_path) or os.path.islink(absolute_data_file_path):
                annotation_relative_file_path = directory + file_name
                if annotation_relative_file_path.endswith(".pdf.annotations"):
                    main_annotation_relative_file_paths.append(annotation_relative_file_path)
                else:
                    user_specific_annotation_relative_file_paths.append(annotation_relative_file_path)

            else:
                broken_annotation_file_paths.append(dir_path + file_name)

    if broken_annotation_file_paths:
        print_warning("{} broken annotation file paths: {}".format(len(broken_annotation_file_paths), "\n".join(broken_annotation_file_paths)))

    return {
        "main_annotation_relative_file_paths": main_annotation_relative_file_paths,
        "user_specific_annotation_relative_file_paths": user_specific_annotation_relative_file_paths,
    }
