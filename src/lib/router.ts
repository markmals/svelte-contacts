import { goto } from "$app/navigation";
import { navigating, page } from "$app/state";

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

// Yoinked from React Router: https://reactrouter.com/tutorials/address-book#submitting-forms-onchange
// See also: https://api.reactrouter.com/v7/functions/react_router.useSubmit
async function submit(target: SubmitTarget, options?: Options) {
    if (!target) {
        return;
    }

    type ToString = { toString(): string };
    let entries: Iterable<[string, ToString | null]> = [];
    let search = new URLSearchParams();

    if (target instanceof HTMLFormElement) {
        entries = new FormData(target).entries();
    } else if (target instanceof HTMLButtonElement || target instanceof HTMLInputElement) {
        if (!target.form) return;
        entries = new FormData(target.form).entries();
    } else if (target instanceof FormData) {
        entries = target.entries();
    } else if (target instanceof URLSearchParams) {
        search = target;
    } else {
        // Handle JSON value
        if (typeof target === "object" && target !== null) {
            entries = Object.entries(target);
        }
    }

    for (const [key, value] of entries) {
        if (value) search.append(key, value.toString());
    }

    await goto(`${page.url.pathname === "/" ? "" : page.url.pathname}?${search}`, options);
}

export async function navigate(to: To, options?: Options): Promise<void>;
export async function navigate(target: SubmitTarget, options?: Options): Promise<void>;
export async function navigate(target: To | SubmitTarget, options?: Options): Promise<void> {
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
        return await submit(target, options);
    }

    return await goto(target.toString(), options);
}

export function isActive(href: string): boolean {
    return page.url.pathname === href.split("?")[0];
}

export function isPending(href: string): boolean {
    return navigating.to?.url.pathname === href.split("?")[0];
}
