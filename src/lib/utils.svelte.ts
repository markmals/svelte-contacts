import { goto } from "$app/navigation";
import type { SubmitFunction } from "@sveltejs/kit";

export function submit(data: FormData | HTMLFormElement | null, opts: Parameters<typeof goto>[1]) {
    const formData = data instanceof FormData ? data : new FormData(data ?? undefined);
    const search = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        search.append(key, value.toString());
    }

    goto(`/?${search}`, opts);
}

export class Fetcher {
    action: URL | null = $state(null);
    formData: FormData | null = $state(null);
    formElement: HTMLFormElement | null = $state(null);
    controller: AbortController | null = $state(null);
    submitter: HTMLElement | null = $state(null);
    #canceller: (() => void) | null = $state(null);

    enhance = (input: Parameters<SubmitFunction>[0]) => {
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
