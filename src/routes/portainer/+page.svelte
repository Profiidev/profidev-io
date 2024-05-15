<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

{#await data.url then url}
  <iframe src={`https://${url}`} title="Portainer" ></iframe>
{/await}

<style>
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
