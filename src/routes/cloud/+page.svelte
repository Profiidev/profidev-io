<script lang="ts">
  import type { PageData } from "../$types";
  import { onMount } from "svelte";
  import Loader from "$lib/components/Loader.svelte";
  import { isValid } from "$lib/auth";
  import Checkbox from "$lib/components/Checkbox.svelte";

  export let data: PageData;

  onMount(async () => {
    console.log("data", await data.content);
  });
</script>

{#if $isValid}
  <div class="container-background">
    <div class="container scrollbar">
      {#await data.content}
        <Loader />
      {:then content}
        {#each content.files as file}
          <div class="file">
            <i class="bx bx-folder"></i>
            <p class="file-name">{file.name}</p>
            <Checkbox />
          </div>
        {/each}
      {/await}
    </div>
  </div>
{:else}
  <div class="not-container">
    <p class="not-logged-in">Not authorized</p>
  </div>
{/if}

<style>
   .container-background {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    margin: 20px;
    background-color: var(--background-color2);
    border-radius: 20px;
    display: flex;

  }

  .container {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 600;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    font-size: 18px;
    box-sizing: border-box;
    background-image: linear-gradient(var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-clip: text;
    background-attachment: fixed;
    color: transparent;
    overflow-y: auto;
  }

  .file {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 30px;
  }

  .file-name {
    margin: 0;
    padding: 0;
    margin-left: 15px;
  }

  .file-selector {
    margin-left: auto;
    width: 15px;
    height: 15px;
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