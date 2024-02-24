<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<iframe src={`https://${data.url}`} title="Portainer" ></iframe>

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