
# 2021-03-01

## Breaking changes

1. The config files in `/config` no longer use the `local_vault_id` attribute.  Instead the local_vault_id (used in the urls for the vault files) is derived from the file name.  Rationale: this simplification might be limiting for some use cases but is easily added back if strong demand from users.
