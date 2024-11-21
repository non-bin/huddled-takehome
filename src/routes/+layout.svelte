<script lang="ts">
  import { page } from "$app/stores";
  import "../app.css";
</script>

<main
  class="bg-slate-200 dark:bg-slate-950 dark:text-slate-200 w-full h-screen"
>
  <nav
    class="max-w-64 flex items-center justify-between gap-4 p-2"
  >
    <a
      href="/task-1"
      class="text-lg font-semibold w-full p-2 rounded text-center {($page.url.pathname === '/task-1') ? 'bg-sky-600' : 'dark:bg-sky-800/20'}">Task 1</a
    >
    <a
      href="/task-2"
      class="text-lg font-semibold w-full p-2 rounded text-center {($page.url.pathname === '/task-2') ? 'bg-sky-600' : 'dark:bg-sky-800/20'}">Task 2</a
    >
  </nav>
  <slot></slot>
</main>
