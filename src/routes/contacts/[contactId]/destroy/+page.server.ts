import { deleteContact } from "$lib/contacts";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ params }) => {
        await deleteContact(params.contactId);
        throw redirect(303, "/");
    },
};
