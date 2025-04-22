<script lang="ts">
    import styles from "../styles/index.css?url";

    import { enhance } from "$app/forms";
    import type { LayoutProps } from "./$types";
    import NavLink from "$lib/components/NavLink.svelte";
    import { navigating, page } from "$app/state";
    import { navigate } from "$lib/router";

    const { children, data }: LayoutProps = $props();
    const contacts = $derived(data.contacts);
    const query = $derived(data.q);

    const searchParams = $derived(page.url.search);

    const previousSearchParams = $derived(navigating.from?.url.search || "");
    const nextSearchParams = $derived(navigating.to?.url.search || "");

    const searching = $derived(
        Boolean(
            previousSearchParams !== nextSearchParams && navigating.to?.url.searchParams.has("q"),
        ),
    );

    function search(event: { currentTarget: HTMLInputElement }) {
        // Remove empty query params when searchbox value is empty
        if (!event.currentTarget.value) {
            navigate("/");
            return;
        }

        const isFirstSearch = query === null;
        // FIXME: This causes loss of focus on every keystroke (e.g. event)
        navigate(event.currentTarget.form, { replaceState: !isFirstSearch });
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
                value={query}
                oninput={search}
                class={searching ? "loading" : ""}
            />
            <div aria-hidden={!searching} hidden={!searching} id="search-spinner"></div>
            <div aria-live="polite" class="sr-only"></div>
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

<div id="detail" class={navigating.to !== null ? "loading" : ""}>
    {@render children()}
</div>
