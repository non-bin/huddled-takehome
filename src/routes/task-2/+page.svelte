<script lang="ts">
  import EngagementTable from '$lib/components/engagementTrendTable.svelte';
  import Chart from '$lib/components/Chart.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let artistID = $state(1);
</script>

<button onclick={() => artistID++}>
  Artist ID: {artistID}
</button>
<div class="flex flex-col items-center justify-center">
  <Chart data={data.data} {artistID} />
</div>
<div class="flex flex-col">
  <EngagementTable artistTrends={data.data} />
</div>
