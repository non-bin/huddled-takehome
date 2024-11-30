<script lang="ts">
  import EngagementTable from "$lib/components/engagementTrendTable.svelte";
import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col"> <!-- items-center justify-center -->
  <EngagementTable artistTrends={data.data} />
</div>
