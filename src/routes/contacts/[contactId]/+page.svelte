<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/state";
    import Favorite from "$lib/components/Favorite.svelte";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
    const contact = $derived(data.contact);

    function confirmDelete(event: Event) {
        if (!confirm("Please confirm you want to delete this record.")) {
            event.preventDefault();
        }
    }
</script>

<div id="contact">
    <div>
        <img alt="{contact.first} {contact.last} avatar" src={contact.avatar} />
    </div>

    <div>
        <h1>
            {#if contact.first || contact.last}
                {contact.first} {contact.last}
            {:else}
                <i>No Name</i>
            {/if}
            <Favorite {contact} />
        </h1>

        {#if contact.bsky}
            <p>
                <a href={`https://bsky.app/profile/${contact.bsky}`} target="_blank">
                    {contact.bsky}
                </a>
            </p>
        {/if}

        {#if contact.notes}
            <p>{contact.notes}</p>
        {/if}

        <div>
            <form action={`${page.url.pathname}/edit`} method="get">
                <button type="submit">Edit</button>
            </form>

            <form
                action={`${page.url.pathname}/destroy`}
                method="post"
                use:enhance
                onsubmit={confirmDelete}
            >
                <button type="submit">Delete</button>
            </form>
        </div>
    </div>
</div>
