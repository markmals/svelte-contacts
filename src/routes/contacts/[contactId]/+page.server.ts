import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { fakeNetwork, updateContact } from "$lib/db/contacts";

export const load: PageServerLoad = async ({ params, parent }) => {
    const contactId = params.contactId;

    // Since we're being smart and calling `parent()` instead of `getContact()` here,
    // we don't see the loading states, so we have to fake the network latency dirctly
    // in this loader.
    await fakeNetwork(`contact:${contactId}`);

    const { contacts } = await parent();
    const contact = contacts.find(c => c.id === contactId);

    if (!contact) {
        throw error(404, { message: "Not Found" });
    }

    return { contact };
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const formData = await request.formData();
        // throw new Error("no!");
        return updateContact(params.contactId, {
            favorite: formData.get("favorite") === "true",
        });
    },
};
