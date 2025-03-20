import { page, navigating } from "$app/state";

export function getNavLinkState(path: string) {
    return {
        get isActive() {
            return page.url.pathname === path;
        },
        get isPending() {
            return navigating.to?.url.pathname === path;
        },
    };
}

export const navigation = {
    get isLoading() {
        return navigating.to !== null;
    },
};

// SvelteKit's `navigating` object
// const navigating: {
//     readonly from: NavigationTarget | null;
//     readonly to: NavigationTarget | null;
//     readonly type: "form" | "leave" | "link" | "goto" | "popstate" | null;
//     readonly willUnload: boolean | null;
//     readonly delta: number | ... 1 more ... | undefined;
//     readonly complete: Promise<...> | null;
// }
