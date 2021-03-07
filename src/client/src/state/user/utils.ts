


const safe_regexp = new RegExp("[^a-z0-9_]", "g")
export function get_safe_user_name (user_name: string)
{
    return user_name.trim().toLowerCase().replace(safe_regexp, "_")
}
