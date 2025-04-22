<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
    const contact = $derived(data.contact);

    function cancelEdit() {
        history.back();
    }
</script>

<svelte:head>
    <title>{`Editing ${contact.first} ${contact.last} | Svelte Contacts`}</title>
</svelte:head>

<form id="contact-form" method="post" use:enhance>
    <p>
        <span>Name</span>
        <input
            aria-label="First name"
            value={contact.first}
            name="first"
            placeholder="First"
            type="text"
        />
        <input
            aria-label="Last name"
            value={contact.last}
            name="last"
            placeholder="Last"
            type="text"
        />
    </p>

    <label>
        <span>Bluesky</span>
        <input value={contact.bsky} name="bsky" placeholder="@jay.bsky.team" type="text" />
    </label>

    <label>
        <span>Avatar URL</span>
        <input
            aria-label="Avatar URL"
            value={contact.avatar}
            name="avatar"
            placeholder="https://example.com/avatar.jpg"
            type="text"
        />
    </label>

    <label>
        <span>Notes</span>
        <textarea value={contact.notes} name="notes" rows={6}></textarea>
    </label>

    <p>
        <button type="submit">Save</button>
        <button type="button" onclick={cancelEdit}>Cancel</button>
    </p>
</form>
