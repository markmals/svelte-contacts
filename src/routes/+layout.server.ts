import type { LayoutServerLoad } from "./$types";
import { getContacts } from "$lib/db/contacts";

export const load: LayoutServerLoad = async ({ url }) => {
    const q = url.searchParams.get("q");
    return { contacts: await getContacts(q), q };
};
