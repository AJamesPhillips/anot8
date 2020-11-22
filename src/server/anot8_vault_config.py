
import json
import os
from pathlib import Path

from common import check_for_required_attributes


def get_anot8_vault_config_file_path (vault_config):
    anot8_vault_config_dir_path = vault_config["root_path"]
    return anot8_vault_config_dir_path + "anot8_vault_config.json"


def upsert_anot8_vault_config (local_vault_config):
    dir_path = local_vault_config["root_path"]
    Path(dir_path).mkdir(parents=True, exist_ok=True)

    anot8_vault_config_file_path = get_anot8_vault_config_file_path(local_vault_config)

    if not os.path.isfile(anot8_vault_config_file_path):
        default_anot8_vault_config = {
            "naming_authority": "",
            # Set alternative_local_vault_id to the id for anot8 to enable these links to
            # work locally and the same for all users of the vault
            "alternative_local_vault_id": "",
            "publish_root_path": "",
            "directories": [],
            "labels": [],
            "DO_NOT_EDIT_auto_generated_fields": {
                "schema_version": 1,
                "id_to_relative_file_name": {},
                "next_id": 1,
            },
        }

        vault_config = {
            **local_vault_config,
            **default_anot8_vault_config
        }

        write_anot8_vault_config(vault_config)

    with open(anot8_vault_config_file_path, "r", encoding="utf8") as f:
        anot8_vault_config = json.load(f)

    result = check_anot8_vault_config(anot8_vault_config)

    if not result[0]:
        raise Exception(result[1] + " in " + anot8_vault_config_file_path)

    vault_config = {
        **local_vault_config,
        **anot8_vault_config
    }

    return vault_config


def write_anot8_vault_config (vault_config):
    anot8_vault_config_file_path = get_anot8_vault_config_file_path(vault_config)

    anot8_vault_config = {
        "naming_authority": vault_config["naming_authority"],
        "alternative_local_vault_id": vault_config["alternative_local_vault_id"],
        "publish_root_path": vault_config["publish_root_path"],
        "directories": vault_config["directories"],
        "labels": vault_config["labels"],
        "DO_NOT_EDIT_auto_generated_fields": vault_config["DO_NOT_EDIT_auto_generated_fields"]
    }

    with open(anot8_vault_config_file_path, "w", encoding="utf8") as f:
        json.dump(anot8_vault_config, f, indent=2, ensure_ascii=False)


def check_anot8_vault_config (anot8_vault_config):
    required_attributes = [
        ["naming_authority", str],
        ["alternative_local_vault_id", str],
        ["publish_root_path", str],
        ["directories", list, str],
        ["labels", list, str],
    ]

    return check_for_required_attributes(anot8_vault_config, required_attributes)
