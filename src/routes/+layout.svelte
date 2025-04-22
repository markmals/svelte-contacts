<script lang="ts">
    import styles from "../styles/index.css?url";

    import { enhance } from "$app/forms";
    import type { LayoutProps } from "./$types";
    import NavLink from "$lib/components/NavLink.svelte";
    import { Router } from "$lib/router";

    const { children, data }: LayoutProps = $props();
    const contacts = $derived(data.contacts);
    const q = $derived(data.q);

    const router = new Router();
    const searchParams = $derived(router.location.search);

    function handleInput(event: { currentTarget: HTMLInputElement }) {
        // Remove empty query params when searchbox value is empty
        if (!event.currentTarget.value) {
            router.navigate("/");
            return;
        }

        const isFirstSearch = q === null;
        // FIXME: This causes loss of focus on every keystroke (e.g. event)
        router.navigate(event.currentTarget.form, { replaceState: !isFirstSearch });
    }
</script>

<svelte:head>
    <link rel="stylesheet" href={styles} />
    <title>Svelte Contacts</title>
</svelte:head>

<div id="sidebar">
    <h1>SvelteKit Contacts</h1>

    <div>
        <form id="search-form" role="search" method="get">
            <input
                aria-label="Search contacts"
                id="q"
                name="q"
                placeholder="Search"
                type="search"
                value={q}
                oninput={handleInput}
            />
            <div aria-hidden="true" hidden id="search-spinner"></div>
        </form>

        <form method="post" action="/" use:enhance>
            <button type="submit">New</button>
        </form>
    </div>

    <nav>
        {#if contacts.length}
            <ul>
                {#each contacts as contact (contact.id)}
                    <li>
                        <NavLink
                            href={`/contacts/${contact.id}${searchParams}`}
                            class={state =>
                                state.isActive ? "active" : state.isPending ? "pending" : ""}
                        >
                            {#if contact.first || contact.last}
                                {contact.first} {contact.last}
                            {:else}
                                <i>No Name</i>
                            {/if}

                            {#if contact.favorite}
                                <span>★</span>
                            {/if}
                        </NavLink>
                    </li>
                {/each}
            </ul>
        {:else}
            <p><i>No contacts</i></p>
        {/if}
    </nav>
</div>

<div id="detail" class={router.navigating.to !== null ? "loading" : ""}>
    {@render children()}
</div>
