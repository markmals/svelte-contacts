import { goto } from "$app/navigation";
import { page } from "$app/state";

export function submit(data: FormData | HTMLFormElement | null, opts: Parameters<typeof goto>[1]) {
    const formData = data instanceof FormData ? data : new FormData(data ?? undefined);
    const search = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        search.append(key, value.toString());
    }

    goto(`${page.url.pathname === "/" ? "" : page.url.pathname}/?${search}`, opts);
}
