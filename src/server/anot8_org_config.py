
import json
import os

from id_mappings import upsert_file_perma_ids_mapping_for_all_vaults, get_id_map
from vault_config import get_vault_configs
from common import anot8_org_config_dir_path, print_warning


def upsert_perma_id_mappings_and_anot8_config ():
    upsert_file_perma_ids_mapping_for_all_vaults()
    update_anot8_configs()


def update_anot8_configs ():
    vault_configs = get_vault_configs()

    for vault_config in vault_configs.values():
        update_anot8_config(vault_config)


def update_anot8_config (vault_config):
    anot8_org_config_file_name = anot8_org_config_dir_path + str(vault_config["vault_id"]) + ".json"

    publish_root_path = vault_config.get("publish_root_path", "")
    id_to_relative_file_name = get_id_map(vault_config)["id_to_relative_file_name"]

    if not publish_root_path:
        # print_warning("No publish_root_path attribute for vault_config {vault_id}, {vault_name}".format(**vault_config))
        if os.path.isfile(anot8_org_config_file_name):
            os.remove(anot8_org_config_file_name)
        return

    with open(anot8_org_config_file_name, "w") as f:
        config = dict(
            publish_root_path=publish_root_path,
            id_to_relative_file_name=id_to_relative_file_name,
            schema_version=1,
        )
        json.dump(config, f, indent=0, ensure_ascii=False)
