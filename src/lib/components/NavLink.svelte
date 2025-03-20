<script module lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAnchorAttributes } from "svelte/elements";

    export interface Props extends Exclude<HTMLAnchorAttributes, "class"> {
        children: Snippet;
        href: string;
        class: (props: { get isActive(): boolean; get isPending(): boolean }) => string;
    }
</script>

<script lang="ts">
    import { page, navigating } from "$app/state";

    const { children, href, class: getClass, ...props }: Props = $props();
    const state = {
        get isActive() {
            return page.url.pathname === href;
        },
        get isPending() {
            return navigating.to?.url.pathname === href;
        },
    };
</script>

<a {href} class={getClass(state)} {...props}>
    {@render children()}
</a>
