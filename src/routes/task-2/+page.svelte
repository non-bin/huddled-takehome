<script lang="ts">
  import EngagementTable from '$lib/components/engagementTrendTable.svelte';
  import Chart from '$lib/components/Chart.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let artistIDs = $state([1, 2]);
</script>

<div>
  Artist IDs: {artistIDs.join(', ')}
</div>
<div class="flex flex-col items-center justify-center">
  <Chart data={data.data} {artistIDs} />
</div>
<div class="flex flex-col">
  <EngagementTable artistTrends={data.data} />
</div>
