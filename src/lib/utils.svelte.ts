import { goto } from "$app/navigation";
import { navigating } from "$app/state";
import type { SubmitFunction } from "@sveltejs/kit";

export function submit(data: FormData | HTMLFormElement | null, opts: Parameters<typeof goto>[1]) {
    const formData = data instanceof FormData ? data : new FormData(data ?? undefined);
    const search = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        search.append(key, value.toString());
    }

    goto(`/?${search}`, opts);
}

type FetcherProps = Parameters<SubmitFunction>[0];
type Nullable<T> = T | null;

export class Fetcher {
    action: Nullable<FetcherProps["action"]> = $state(null);
    formData: Nullable<FetcherProps["formData"]> = $state(null);
    formElement: Nullable<FetcherProps["formElement"]> = $state(null);
    controller: Nullable<FetcherProps["controller"]> = $state(null);
    submitter: Nullable<FetcherProps["submitter"]> = $state(null);
    #canceller: Nullable<FetcherProps["cancel"]> = $state(null);

    constructor() {
        $effect(() => {
            // Reset all data when the route changes
            if (navigating.to) {
                this.action = null;
                this.formData = null;
                this.formElement = null;
                this.controller = null;
                this.submitter = null;
                this.#canceller = null;
            }
        });
    }

    handleSubmit: SubmitFunction = input => {
        this.action = input.action;
        this.formData = input.formData;
        this.formElement = input.formElement;
        this.controller = input.controller;
        this.submitter = input.submitter;
        this.#canceller = input.cancel;
    };

    cancel() {
        this.#canceller?.();
    }
}
