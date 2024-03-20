<script lang="ts">
  import type { PageData } from "../../$types";
  import Loader from "$lib/components/Loader.svelte";
  import { isValid } from "$lib/auth";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data: PageData;
  let files: any[] = [];
  let checked: string[] = [];

  $: data, newData();

  $: files = files.sort((a, b) => {
    if (a.dir && !b.dir) return -1;
    if (!a.dir && b.dir) return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  });

  const newData = () => {
    if (data.content)
    data.content.then((content: any) => {
      files = content.files;
    });
  }

  const checkAll = (e: any) => {
    checked = e.target.checked ? files.map((file) => file.name) : [];
  };

  const checkSingle = (e: any, file: any) => {
    if (e.target.checked) {
      checked = [...checked, file.name];
    } else {
      checked = checked.filter((name) => name !== file.name);
    }
  };

  const fileClick = (e: any, file: any) => {
    if (file.dir) {
      let newPath = "";
      if (file.name === "..") {
        if($page.url.pathname === "/cloud") return;
        newPath = $page.url.pathname.split("/").slice(0, -1).join("/");
      } else {
        newPath = $page.url.pathname + "/" + file.name;
      }
      checked = [];
      goto(newPath);
    } else {
      e.target.checked = !checked.includes(file.name);
      checkSingle(e, file);
    }
  };

  const deleteFiles = () => {
    const toDelete = checked.map((name) => files.find((file) => file.name === name));
  };

  const deleteFile = (file: any) => {
    console.log(file);
  };
</script>

{#if $isValid}
  <div class="container-background">
    <div class="container scrollbar">
      <div class="file-header">
        <p class="file-name">Name</p>
        <div class="file-selector">
          {#if checked.length > 0}
            {#if checked.every((name) => files.find((file) => file.name === name).write)}
              <i class='bx bx-trash' style="color: rgb(200, 0, 0)"></i>
            {/if}
            <i class='bx bx-cloud-download' ></i>
          {/if}
          <i class='bx bx-cloud-upload'></i>
          <i class='bx bx-folder-plus' ></i>
          <Checkbox onClick={checkAll} checked={files.length === checked.length} />
        </div>
      </div>
      {#await data.content}
        <Loader />
      {:then content}
        {#if $page.url.pathname !== "/cloud"}
          <button class="file" on:click={(e) => fileClick(e, { dir: true, name: ".." })}>
            <i class="bx bx-folder"></i>
            <p class="file-name">..</p>
          </button>
        {/if}
        {#each files as file}
          <button class="file" on:click={(e) => fileClick(e, file)}>
            <i class={file.dir ? "bx bx-folder" : "bx bx-file-blank"}></i>
            <p class="file-name">{file.name}</p>
            <div class="file-selector">
              {#if file.write}
                <i class='bx bx-trash' style="color: rgb(200, 0, 0)"></i>
              {/if}
              <i class='bx bx-cloud-download' ></i>
              <Checkbox onClick={(e) => checkSingle(e, file)} checked={checked.includes(file.name)} />
            </div>
          </button>
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
    overflow: hidden;
    background: inherit;
    border: none;
    color: inherit;
    font-size: 1em;
    cursor: pointer;
    text-align: left;
    margin: 0;
    padding: 0;
  }

  .file-name {
    margin: 0;
    padding: 0;
    margin-left: 15px;
  }

  .file-selector {
    margin-left: auto;
    margin-right: 5px;
    display: flex;
    flex-direction: row;
  }

  .file-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 30px;
    overflow: hidden;
    border-bottom: 3px solid var(--background-color3);
    margin-bottom: 5px;
  }

  .file-header .file-selector {
    display: flex;
    flex-direction: row;
  }

  .file-selector i {
    margin-right: 10px;
    font-size: 1.2em;
    cursor: pointer;
  }

  .file-header p {
    margin: 0;
    padding: 0;
    margin-left: 30px;
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