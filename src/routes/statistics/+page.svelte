<script lang="ts">
  import { onMount } from "svelte";
  import { isValid, currentUser } from "$lib/auth";
  import Loader from "$lib/components/Loader.svelte";
  import { Permissions, checkPermission } from "$lib/permissions";
  import Card from "$lib/components/Card.svelte";
  import LineChart from "$lib/components/LineChart.svelte";
  import { getCpuDatasets, getDiskDataset, getMemoryDataset, getNetworkDatasets } from "$lib/data";

  let mounted = false;
  let currentFullScreen = '';
  let size = "500px";

  const getCpuData = async (start: number, end: number, step: number) => {
    return getCpuDatasets(false, start, end, step);
  };

  const keypress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      currentFullScreen = '';
    }
  }

  onMount(async () => {
    mounted = true;
  });
</script>

<svelte:window on:keyup={keypress} />

{#if mounted}
  {#if $isValid && checkPermission($currentUser?.permissions, Permissions.Metrics)}
    <div class="conatiner scrollbar">
      <Card size={size} id="cpu" bind:currentFullScreen={currentFullScreen}>
        <LineChart header="Cpu Usage" simple={false} load={getCpuData} />
      </Card>
      <Card size={size} id="memory" bind:currentFullScreen={currentFullScreen}>
        <LineChart header="Memory Usage" simple={false} load={getMemoryDataset} />
      </Card> 
      <Card size={size} id="netowrk" bind:currentFullScreen={currentFullScreen}>
        <LineChart header="Network Usage" simple={false} load={getNetworkDatasets} unit={"B"} />
      </Card> 
      <Card size={size} id="disk" bind:currentFullScreen={currentFullScreen}>
        <LineChart header="Disk Usage" simple={false} load={getDiskDataset} unit={"GB"} />
      </Card> 
    </div>
  {:else}
    <div class="not-container">
      <p class="not-logged-in">Not authorized</p>
    </div>
  {/if}
{:else}
  <Loader blur={true} scale={.75} />
{/if}

<style>
  .conatiner {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    height: 100%;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
  }

  .not-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .not-logged-in {
    color: var(--error-color);
    font-size: 2em;
    text-align: center;
  }
</style>