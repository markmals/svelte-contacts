import { goto } from "$app/navigation";
import { navigating, page } from "$app/state";
import type { Navigation } from "@sveltejs/kit";

type JsonObject = {
    [Key in string]: JsonValue;
} & {
    [Key in string]?: JsonValue | undefined;
};
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

interface Path {
    /**
     * A URL pathname, beginning with a /.
     */
    pathname: string;
    /**
     * A URL search string, beginning with a ?.
     */
    search: string;
    /**
     * A URL fragment identifier, beginning with a #.
     */
    hash: string;
}

type To = string; // | Partial<Path>;

type SubmitTarget =
    | HTMLFormElement
    | HTMLButtonElement
    | HTMLInputElement
    | FormData
    | URLSearchParams
    | JsonValue
    | null;

type Options = Parameters<typeof goto>[1];

export class Router {
    get location(): URL {
        return page.url;
    }

    get navigating():
        | Navigation
        | { from: null; to: null; type: null; willUnload: null; delta: null; complete: null } {
        return navigating;
    }

    // Yoinked from React Router: https://reactrouter.com/tutorials/address-book#submitting-forms-onchange
    // See also: https://api.reactrouter.com/v7/functions/react_router.useSubmit
    async #submit(target: SubmitTarget, options?: Options) {
        if (!target) {
            return;
        }

        let entries: Iterable<[string, string]> = [];
        let search = new URLSearchParams();

        if (target instanceof HTMLFormElement) {
            entries = new FormData(target).entries() as any;
        } else if (target instanceof HTMLButtonElement || target instanceof HTMLInputElement) {
            const form = target.form;
            if (!form) return;
            const formData = new FormData(form);
            // Add the button/input value if it has a name
            if (target.name) {
                formData.append(target.name, target.value);
            }
            entries = formData.entries() as any;
        } else if (target instanceof FormData) {
            entries = target.entries() as any;
        } else if (target instanceof URLSearchParams) {
            search = target;
        } else {
            // Handle JSON value
            if (typeof target === "object" && target !== null) {
                entries = Object.entries(target) as any;
            }
        }

        for (const [key, value] of entries) {
            search.append(key, value.toString());
        }

        await goto(`${page.url.pathname === "/" ? "" : page.url.pathname}?${search}`, options);
    }

    async navigate(to: To, options?: Options): Promise<void>;
    async navigate(target: SubmitTarget, options?: Options): Promise<void>;
    async navigate(target: To | SubmitTarget, options?: Options): Promise<void> {
        if (
            target instanceof HTMLFormElement ||
            target instanceof HTMLButtonElement ||
            target instanceof HTMLInputElement ||
            target instanceof FormData ||
            target instanceof URLSearchParams ||
            typeof target === "boolean" ||
            (target !== null && typeof target === "object") ||
            target === null
        ) {
            return await this.#submit(target, options);
        }

        return await goto(target.toString(), options);
    }

    isActive(href: string): boolean {
        return page.url.pathname === href.split("?")[0];
    }

    isPending(href: string): boolean {
        return navigating.to?.url.pathname === href.split("?")[0];
    }
}
