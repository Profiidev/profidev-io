<script lang="ts">
  import LineChart from "$lib/components/LineChart.svelte";
  import 'chartjs-adapter-luxon';
  import { onMount } from "svelte";
  import type { Dataset } from "$lib/types";
  import { getCpuDatasets, getMemoryDataset } from "$lib/data";
  import { getAPOD } from "$lib/images";
  import { isValid, currentUser } from "$lib/auth";
  import Loader from "$lib/components/Loader.svelte";
  import { Permissions, checkPermission } from "$lib/permissions";

  let timeLabels: string[] = [];
  let cpuDatasets: Dataset[] = [];
  let memoryDatasets: Dataset[] = [];
  let apod: string;
  let size = "500px";
  let imageWidthScale = 1;
  let imageHeightScale = 1;
  let mounted = false;
  
  const updateData = () => {
    getCpuDatasets(true).then((data) => {
      timeLabels = data.timeLabels;
      cpuDatasets = data.cpuDatasets;
    });
    getMemoryDataset().then((data) => {
      memoryDatasets = data;
    });
    getAPOD().then((data) => {
      apod = data;
    });
  }
  ;
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

  onMount(() => {
    mounted = true;
    updateData();
  });
</script>

{#if mounted}
  {#if $isValid}
    <div class="conatiner">
      {#if checkPermission($currentUser?.permissions, Permissions.Metrics)}
        <LineChart size={size} datasets={cpuDatasets} labels={timeLabels} header="Cpu Usage" />
        <LineChart size={size} datasets={memoryDatasets} labels={timeLabels} header="Memory Usage" />
      {/if}
      <div class="apod-container" style="--size: {size}; --scaleW: {imageWidthScale}; --scaleH: {imageHeightScale};">
        <div class="apod">
          <img src={apod} alt="APOD" on:load={load} />
        </div>
      </div>
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
    align-items: center;
    flex-wrap: wrap;
    height: 100%;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
  }

  .apod-container {
    width: var(--size);
    height: var(--size);
    background-image: linear-gradient(163deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    border-radius: 22px;
    transition: all .3s;
    margin: 20px;
  }

  .apod {
    width: 100%;
    height: 100%;
    background-color: var(--background-color2);
    border-radius: 20px;
    transition: all .2s;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(1.01);
  }

  .apod:hover {
    transform: scale(.98);
    border-radius: 20px;
  }

  .apod img {
    width: calc(var(--size) * var(--scaleW));
    height: calc(var(--size) * var(--scaleH));
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