import { enhance } from "$app/forms";
import { navigating } from "$app/state";
import type { SubmitFunction } from "@sveltejs/kit";

type FetcherProps = Parameters<SubmitFunction>[0];
type Nullable<T> = T | null;

export class Fetcher {
    action: Nullable<FetcherProps["action"]> = $state(null);
    formData: Nullable<FetcherProps["formData"]> = $state(null);
    formElement: Nullable<FetcherProps["formElement"]> = $state(null);
    controller: Nullable<FetcherProps["controller"]> = $state(null);
    submitter: Nullable<FetcherProps["submitter"]> = $state(null);
    #canceller: Nullable<FetcherProps["cancel"]> = $state(null);

    cancel() {
        this.#canceller?.();
    }

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

    #submit: SubmitFunction = input => {
        this.action = input.action;
        this.formData = input.formData;
        this.formElement = input.formElement;
        this.controller = input.controller;
        this.submitter = input.submitter;
        this.#canceller = input.cancel;
    };

    enhance(form: HTMLFormElement) {
        return enhance(form, this.#submit);
    }
}
