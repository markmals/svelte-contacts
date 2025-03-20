import { error, redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { getContact, updateContact } from "$lib/contacts";

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

        // Trim any leading @'s off of bsky handle
        if (updates.bsky && typeof updates.bsky === "string") {
            updates.bsky = updates.bsky.replace(/^@+/, "");
        }

        try {
            await updateContact(params.contactId, updates);
        } catch (err) {
            return fail(400, { error: "Failed to update contact." });
        }

        throw redirect(303, `/contacts/${params.contactId}`);
    },
};
