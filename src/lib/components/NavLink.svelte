<script module lang="ts">
    import { isActive, isPending } from "$lib/router";
    import type { Snippet } from "svelte";
    import type { HTMLAnchorAttributes } from "svelte/elements";

    export interface Props extends Exclude<HTMLAnchorAttributes, "class"> {
        children: Snippet;
        href: string;
        class: (props: { get isActive(): boolean; get isPending(): boolean }) => string;
    }
</script>

<script lang="ts">
    const { children, href, class: getClass, ...props }: Props = $props();
    const state = {
        get isActive() {
            return isActive(href);
        },
        get isPending() {
            return isPending(href);
        },
    };
</script>

<a {href} class={getClass(state)} {...props}>
    {@render children()}
</a>
