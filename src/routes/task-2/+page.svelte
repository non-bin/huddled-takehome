<script lang="ts">
  import EngagementTable from "$lib/components/engagementTrendTable.svelte";
  import Chart from "$lib/components/Chart.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center justify-center">
  <Chart data={data.data} />
</div>
<div class="flex flex-col"> <!-- items-center justify-center -->
  <EngagementTable artistTrends={data.data} />
</div>
