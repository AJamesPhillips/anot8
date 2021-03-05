import { State } from "../state/state"



export const get_anot8_perma_link = ({ routing }: State) =>
{
    const { naming_authority, vault_id, file_id } = routing

    let anot8_perma_link = ""

    if (naming_authority !== "-1" && vault_id !== "-1" && file_id !== "-1")
    {
        anot8_perma_link = `https://anot8.org/r/${naming_authority}.${vault_id}/${file_id}`
    }

    return anot8_perma_link
}
