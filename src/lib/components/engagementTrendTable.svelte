<script lang="ts">
  let { artistTrends } = $props();

  let allSelected = $state(false);
</script>

<div class="overflow-x-auto">
  <div
    class="min-w-max w-[60rem] h-[60rem] overflow-y-auto relative scrollbar-pretty"
  >
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"
      >
        <tr>
          <th scope="col" class="px-6 py-3"
            ><input
              type="checkbox"
              checked={allSelected}
              onchange={() => {
                allSelected = !allSelected;
                for (
                  let artistID = 0;
                  artistID < artistTrends.length;
                  artistID++
                ) {
                  const artist = artistTrends[artistID];
                  if (typeof artist !== 'undefined') {
                    artist.selected = allSelected;
                  }
                }
              }}
            /></th
          >
          <th scope="col" class="px-6 py-3">Artist Name</th>
          <th scope="col" class="px-6 py-3">12am</th>
          <th scope="col" class="px-6 py-3">1am</th>
          <th scope="col" class="px-6 py-3">2am</th>
          <th scope="col" class="px-6 py-3">3am</th>
          <th scope="col" class="px-6 py-3">4am</th>
          <th scope="col" class="px-6 py-3">5am</th>
          <th scope="col" class="px-6 py-3">6am</th>
          <th scope="col" class="px-6 py-3">7am</th>
          <th scope="col" class="px-6 py-3">8am</th>
          <th scope="col" class="px-6 py-3">9am</th>
          <th scope="col" class="px-6 py-3">10am</th>
          <th scope="col" class="px-6 py-3">11am</th>
          <th scope="col" class="px-6 py-3">12pm</th>
          <th scope="col" class="px-6 py-3">1pm</th>
          <th scope="col" class="px-6 py-3">2pm</th>
          <th scope="col" class="px-6 py-3">3pm</th>
          <th scope="col" class="px-6 py-3">4pm</th>
          <th scope="col" class="px-6 py-3">5pm</th>
          <th scope="col" class="px-6 py-3">6pm</th>
          <th scope="col" class="px-6 py-3">7pm</th>
          <th scope="col" class="px-6 py-3">8pm</th>
          <th scope="col" class="px-6 py-3">9pm</th>
          <th scope="col" class="px-6 py-3">10pm</th>
          <th scope="col" class="px-6 py-3">11pm</th>
        </tr>
      </thead>
      <tbody>
        {#each artistTrends as artist}
          <!-- Skip empty or invalid rows -->
          {#if typeof artist !== 'undefined' && Object.hasOwn(artist, 'artistName') && Object.hasOwn(artist, 'scoresByHour') && artist.scoresByHour.length === 24}
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="px-6 py-4"
                ><input
                  type="checkbox"
                  checked={artist.selected}
                  onchange={(element) => (artist.selected = !artist.selected)}
                /></td
              >
              <td
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {artist.artistName}
              </td>
              <td class="px-6 py-4">{artist.scoresByHour[0]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[1]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[2]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[3]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[4]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[5]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[6]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[7]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[8]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[9]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[10]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[11]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[12]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[13]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[14]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[15]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[16]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[17]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[18]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[19]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[20]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[21]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[22]}</td>
              <td class="px-6 py-4">{artist.scoresByHour[23]}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  /* Custom scrollbar styles */
  .scrollbar-pretty::-webkit-scrollbar {
    width: 10px;
  }

  .scrollbar-pretty::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  .scrollbar-pretty::-webkit-scrollbar-thumb {
    background: rgba(149, 158, 160, 0.5);
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .scrollbar-pretty::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.7);
  }
</style>
