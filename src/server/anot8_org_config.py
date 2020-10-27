
import json
import os
from pathlib import Path

from common import check_for_required_attributes


def get_anot8_config_dir_path (vault_config):
    return "{root_path}anot8_org_config/".format(**vault_config)


def get_anot8_config_file_path (vault_config):
    anot8_config_dir_path = get_anot8_config_dir_path(vault_config)
    return anot8_config_dir_path + "{vault_id}.json".format(**vault_config)


def upsert_anot8_vault_config (vault_config):
    dir_path = get_anot8_config_dir_path(vault_config)
    Path(dir_path).mkdir(parents=True, exist_ok=True)

    anot8_org_config_file_path = get_anot8_config_file_path(vault_config)

    if not os.path.isfile(anot8_org_config_file_path):
        default_config = {
            **vault_config,
            "naming_authority": "",
            "publish_root_path": "",
            "directories": [],
            "labels": [],
            "DO_NOT_EDIT_auto_generated_fields": {
                "schema_version": 1,
                "id_to_relative_file_name": {},
                "next_id": 1,
            },
        }

        write_anot8_org_vault_config(default_config)

    with open(anot8_org_config_file_path, "r", encoding="utf8") as f:
        anot8_org_vault_config = json.load(f)

    result = check_anot8_vault_config(anot8_org_vault_config)

    if not result[0]:
        raise Exception(result[1])

    all_vault_config = {
        **vault_config,
        **anot8_org_vault_config
    }

    return all_vault_config


def write_anot8_org_vault_config (vault_config):
    anot8_org_config_file_path = get_anot8_config_file_path(vault_config)

    anot8_org_vault_config = {
        "naming_authority": vault_config["naming_authority"],
        "publish_root_path": vault_config["publish_root_path"],
        "directories": vault_config["directories"],
        "labels": vault_config["labels"],
        "DO_NOT_EDIT_auto_generated_fields": vault_config["DO_NOT_EDIT_auto_generated_fields"]
    }

    with open(anot8_org_config_file_path, "w", encoding="utf8") as f:
        json.dump(anot8_org_vault_config, f, indent=2, ensure_ascii=False)


def check_anot8_vault_config (anot8_vault_config):
    required_attributes = [
        ["naming_authority", str],
        ["publish_root_path", str],
        ["directories", list, str],
        ["labels", list, str],
    ]

    return check_for_required_attributes(anot8_vault_config, required_attributes)
