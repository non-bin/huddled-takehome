<script lang="ts">
  import ArtistTable from "$lib/components/artistTable.svelte";
import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center justify-center">
  <ArtistTable artistVisits={data.data} />
</div>
