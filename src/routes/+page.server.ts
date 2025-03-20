import { createContact } from "$lib/db/contacts";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    default: async () => {
        const contact = await createContact();
        throw redirect(302, `/contacts/${contact.id}/edit`);
    },
} satisfies Actions;
