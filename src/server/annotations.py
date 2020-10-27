import hashlib
import json
import os


from vault_config import get_vault_configs
from common import print_warning


def has_annotations_file (root_path, data_file_relative_file_path):
    return os.path.isfile(root_path + data_file_relative_file_path + ".annotations")


def upsert_meta_data_annotations_file (vault_config, annotations_relative_file_path):
    root_path = vault_config["root_path"]
    data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

    current_schema_version = 5

    if has_annotations_file(root_path, data_file_relative_file_path):
        with open(root_path + annotations_relative_file_path, "r", encoding="utf8") as f:
            meta_data = json.load(f)
    else:
        with open(root_path + data_file_relative_file_path, "rb") as f:
            file_sha1_hash = sha1_hash_file(f)

        meta_data = {
            "file_sha1_hash": file_sha1_hash,
            "annotations": [],
            "comments": [],
            "schema_version": current_schema_version,
        }

    if "version" in meta_data:
        meta_data["schema_version"] = meta_data["version"]

    if meta_data["schema_version"] != current_schema_version:
        meta_data = upgrade_meta_data(meta_data, current_schema_version)

    # meta_data = ensure_consistent_labels(
    #     meta_data=meta_data,
    #     force_update=False,
    #     relative_file_path=relative_file_path,
    # )

    if meta_data["comments"]:
        print("Commments!! ", meta_data["comments"])

    annotations_file_path = root_path + annotations_relative_file_path
    write_annotations_file(annotations_file_path, meta_data)

    return meta_data


def write_annotations_file (annotations_file_path, data):
    with open(annotations_file_path, "w", encoding="utf8") as f:
        json.dump(data, f, indent=0, ensure_ascii=False)


# Adapted from: https://stackoverflow.com/a/22058673/539490
def sha1_hash_file(file_descriptor):
    # BUF_SIZE is totally arbitrary, change for your app!
    BUF_SIZE = 65536  # lets read stuff in 64kb chunks!

    sha1 = hashlib.sha1()

    while True:
        data = file_descriptor.read(BUF_SIZE)
        if not data:
            break
        sha1.update(data)

    return sha1.hexdigest()


def upgrade_meta_data(meta_data, current_schema_version):
    if "relative_file_path" in meta_data:
        del meta_data["relative_file_path"]

    if "version" in meta_data:
        del meta_data["version"]

    for annotation in meta_data["annotations"]:
        if "deleted" in annotation:
            continue

        for (i, label) in enumerate(annotation["labels"]):
            annotation["labels"][i] = label["text"]

    meta_data["schema_version"] = current_schema_version

    return meta_data


def upgrade_all_annotations ():
    for vault_config in get_vault_configs().values():
        file_paths = get_annotation_relative_file_paths_in_vault(vault_config)
        for annotations_relative_file_path in file_paths:
            upsert_meta_data_annotations_file(vault_config, annotations_relative_file_path)


def get_annotation_relative_file_paths_in_vault (vault_config):
    root_path = vault_config["root_path"]
    all_directories = vault_config["all_directories"]

    annotation_file_paths = []
    broken_annotation_file_paths = []

    for directory in all_directories:
        dir_path = root_path + directory
        file_names = os.listdir(dir_path)
        for file_name in file_names:

            is_not_a_file = not os.path.isfile(dir_path + file_name)
            if is_not_a_file or not file_name.endswith(".annotations"):
                continue

            # check corresponding file exists
            data_file_name = file_name.replace(".annotations", "")
            absolute_data_file_path = dir_path + data_file_name
            if os.path.isfile(absolute_data_file_path) or os.path.islink(absolute_data_file_path):
                annotation_file_paths.append(directory + file_name)
            else:
                broken_annotation_file_paths.append(dir_path + file_name)

    if broken_annotation_file_paths:
        print_warning("{} broken annotation file paths: {}".format(len(broken_annotation_file_paths), "\n".join(broken_annotation_file_paths)))

    return annotation_file_paths