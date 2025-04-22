import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { getContact, updateContact } from "$lib/db/contacts";

export const load: PageServerLoad = async ({ params }) => {
    const contactId = params.contactId;
    const contact = await getContact(contactId);

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
