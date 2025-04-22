<script module lang="ts">
    import type { Contact } from "$lib/db/contacts";
    import { Fetcher } from "$lib/fetcher.svelte";

    export interface Props {
        contact: Pick<Contact, "favorite">;
    }
</script>

<script lang="ts">
    const { contact }: Props = $props();
    const fetcher = new Fetcher();
    const favorite = $derived(
        fetcher.formData ? fetcher.formData.get("favorite") === "true" : contact.favorite,
    );
</script>

<form method="post" use:fetcher.enhance>
    <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
    >
        {#if favorite}
            ★
        {:else}
            ☆
        {/if}
    </button>
</form>
