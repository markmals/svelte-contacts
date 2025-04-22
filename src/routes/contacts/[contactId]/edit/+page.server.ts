import { error, redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { getContact, updateContact } from "$lib/db/contacts";

export const load: PageServerLoad = async ({ params }) => {
    const contact = await getContact(params.contactId);

    if (!contact) {
        throw error(404, "Contact not found");
    }

    return { contact };
};

export const actions: Actions = {
    default: async ({ params, request }) => {
        const formData = await request.formData();
        const updates = Object.fromEntries(formData);

        try {
            await updateContact(params.contactId, updates);
        } catch (err) {
            return fail(400, { error: "Failed to update contact." });
        }

        throw redirect(303, `/contacts/${params.contactId}`);
    },
};
