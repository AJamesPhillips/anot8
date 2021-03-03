
# 2021-03-01

## Breaking changes

1. The config files in `/config` no longer use the `local_vault_id` attribute.  Instead the local_vault_id (used in the urls for the vault files) is derived from the file name.  Rationale: the local_vault_id needs to be unique across all the user's local vaults.  Using the file system as a way to enforce uniqueness makes it simpler to code, simpler for the user to understand, and impossible for the user to get wrong.  This simplification might be limiting for some use cases but is easily added back if strong demand from users.

## Other changes

1. The `anot8_vaut_config.json` should be automatic upgraded so that `alternative_local_vault_id` is renamed to `authorised_vault_id`.  Rationale: this name was reflecting how the value could be used but not the primary reason why it would be set / changed.
