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
    import { Router } from "$lib/router";

    const { children, href, class: getClass, ...props }: Props = $props();

    const state = {
        router: new Router(),
        get isActive() {
            return this.router.isActive(href);
        },
        get isPending() {
            return this.router.isPending(href);
        },
    };
</script>

<a {href} class={getClass(state)} {...props}>
    {@render children()}
</a>
