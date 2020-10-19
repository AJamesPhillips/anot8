import hashlib
import json
import os


def has_annotations_file (root_path, data_file_relative_file_path):
    return os.path.isfile(root_path + data_file_relative_file_path + ".annotations")


def upsert_meta_data_annotations_file (vault_config, annotations_relative_file_path):
    root_path = vault_config["root_path"]
    data_file_relative_file_path = annotations_relative_file_path.replace(".annotations", "")

    current_schema_version = 5

    if has_annotations_file(root_path, data_file_relative_file_path):
        with open(root_path + annotations_relative_file_path, "r") as f:
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

    with open(root_path + annotations_relative_file_path, "w") as f:
        json.dump(meta_data, f, indent=0, ensure_ascii=False)

    return meta_data


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
