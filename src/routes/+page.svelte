<script lang="ts">
  import LineChart from "$lib/components/LineChart.svelte";
  import 'chartjs-adapter-luxon';
  import { onMount } from "svelte";
  import type { Dataset } from "$lib/types";
  import { getCpuDatasets, getMemoryDataset } from "$lib/data";
  import { isValid, currentUser } from "$lib/auth";
  import Loader from "$lib/components/Loader.svelte";
  import { Permissions, checkPermission } from "$lib/permissions";
  import type { PageData } from "./$types";
  import Card from "$lib/components/Card.svelte";

  export let data: PageData;

  let timeLabels: string[] = [];
  let cpuDatasets: Dataset[] = [];
  let memoryDatasets: Dataset[] = [];
  let size = "500px";
  let imageWidthScale = 1;
  let imageHeightScale = 1;
  let mounted = false;
  let currentFullScreen = '';

  const getCpuData = async (start: number, end: number, step: number) => {
    return getCpuDatasets(true, start, end, step);
  };

  const load = (img: any) => {
    let width = img.target.naturalWidth;
    let height = img.target.naturalHeight;

    if (width > height) {
      imageWidthScale = 1;
      imageHeightScale = height / width;
    } else {
      imageWidthScale = width / height;
      imageHeightScale = 1;
    }
  }

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
  {#if $isValid}
    <div class="conatiner scrollbar">
      {#if checkPermission($currentUser?.permissions, Permissions.Metrics)}
        <Card size={size} id="cpu" bind:currentFullScreen={currentFullScreen}>
          <LineChart header="Cpu Usage" load={getCpuData} />
        </Card>
        <Card size={size} id="memory" bind:currentFullScreen={currentFullScreen}>
          <LineChart header="Memory Usage" load={getMemoryDataset} />
        </Card>
      {/if}
      <Card size={size} id="apod" bind:currentFullScreen={currentFullScreen}>
        <div class="apod" style="--scaleW: {imageWidthScale}; --scaleH: {imageHeightScale};">
          {#await data then data_loaded}
            {#if data_loaded && data_loaded.media_type === "image"}
              <img src={data_loaded.url} alt="APOD" on:load={load} />
            {:else if data_loaded && data_loaded.media_type === "video"}
              <iframe width="560" height="315" src={data_loaded.url} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            {/if}
          {/await}
        </div>
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

  .apod {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .apod img {
    width: calc(100% * var(--scaleW));
    height: calc(100% * var(--scaleH));
    border-radius: 20px;
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
