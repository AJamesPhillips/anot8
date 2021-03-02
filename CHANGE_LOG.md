
# 2021-03-01

## Breaking changes

1. The config files in `/config` no longer use the `local_vault_id` attribute.  Instead the local_vault_id (used in the urls for the vault files) is derived from the file name.  Rationale: this simplification might be limiting for some use cases but is easily added back if strong demand from users.

## Other changes

1. The `anot8_vaut_config.json` should be automatic upgraded so that `alternative_local_vault_id` is renamed to `authorised_vault_id`.  Rationale: this name was reflecting how the value could be used but not the primary reason why it would be set / changed.
