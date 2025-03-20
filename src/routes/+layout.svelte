<script lang="ts">
    import "../styles/index.css";

    import { enhance } from "$app/forms";
    import type { LayoutProps } from "./$types";
    import { navigation } from "$lib/state";
    import NavLink from "$lib/components/NavLink.svelte";
    import { goto } from "$app/navigation";
    import { submit } from "$lib/utils.svelte";
    import { page } from "$app/state";
    import type { FormEventHandler } from "svelte/elements";

    const { children, data }: LayoutProps = $props();
    const contacts = $derived(data.contacts);
    const q = $derived(data.q);
    const searchParams = $derived(page.url.search);

    function handleInput(event: Parameters<FormEventHandler<HTMLInputElement>>[0]) {
        // Remove empty query params when searchbox value is empty
        if (!event.currentTarget.value) {
            goto("/");
            return;
        }

        const isFirstSearch = q === undefined;
        // FIXME: This causes loss of focus on every keystroke (e.g. event)
        submit(event.currentTarget.form, { replaceState: !isFirstSearch });
    }
</script>

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

<div id="detail" class={navigation.isLoading ? "loading" : ""}>
    {@render children()}
</div>
