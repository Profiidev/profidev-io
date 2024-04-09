<script lang="ts">
  import type { PageData } from "../../$types";
  import Loader from "$lib/components/Loader.svelte";
  import { isValid } from "$lib/auth";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { checkIfExistMultiple, createDir, deleteFile as deleteCloudFile, deleteDir } from "$lib/cloud";
  import { downloadSingleFile, downloadMultipleFiles, uploadFile as uploadCloudFile } from "$lib/cloud";
  import { getFiles } from "$lib/cloud";
  import Dialog from "$lib/components/Dialog.svelte";
  import Button from "$lib/components/Button.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import type { FileData, FileUpload } from "$lib/types";

  export let data: PageData;
  let files: FileData[] = [];
  let checked: string[] = [];
  let modalVisible = false;
  let modalType: "confirm" | "rename" | "create" = "confirm";
  let modalText = "";
  let modalNewName = ""
  let modalConfirm = () => {};
  let dragOver = false;
  let progressVisible = false;
  let progress = 0;
  let progressText = "Uploading...";
  let progressSpeed = "0 KB/s";

  $: data, newData();

  $: files = files.sort((a, b) => {
    if (a.dir && !b.dir) return -1;
    if (!a.dir && b.dir) return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  });

  const convertProgressSpeed = (speed: number) => {
    let speedString = speed.toFixed(2) + " B/s";
    if (speed > 1024 * 1024) {
      speedString = (speed / (1024 * 1024)).toFixed(2) + " MB/s";
    } else if (speed > 1024) {
      speedString = (speed / 1024).toFixed(2) + " KB/s";
    }
    return speedString;
  }

  const newData = () => {
    if (data.content)
    data.content.then((content: any) => {
      files = content.files;
    });
  }

  const checkAll = (e: any) => {
    checked = e.target.checked ? files.map((file) => file.name) : [];
  };

  const checkSingle = (e: any, file: FileData) => {
    if (e.target.checked) {
      checked = [...checked, file.name];
    } else {
      checked = checked.filter((name) => name !== file.name);
    }
  };

  const fileClick = (e: any, file: FileData) => {
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

  const deleteFiles = async (file?: FileData) => {
    let toDelete: FileData[] = [];
    if (file) {
      toDelete.push(file);
    } else {
      toDelete = checked.map((name) => files.find((file) => file.name === name)) as FileData[];
    }
    modalType = "confirm";
    modalText = `Are you sure you want to delete ${toDelete.length} file${toDelete.length > 1 ? "s" : ""}?`;
    modalVisible = true;
    modalConfirm = () => {
      modalVisible = false;
      let done = 0;
      let path = $page.url.pathname.split("/").slice(2).join("/");
      path = path === "" ? "/" : path + "/";
      for (let i = 0; i < toDelete.length; i++) {
        deleteFile(toDelete[i], path).then(() => {
          done++;
          if(done === toDelete.length) {
            reload();
            checked = [];
          }
        });
      }
    };
  };

  const deleteFile = async (file: any, path: string) => {
    if(file.dir) {
      await deleteDir(path + file.name);
    } else {
      await deleteCloudFile(path + file.name);
    }
  };

  const downloadFiles = () => {
    const toDownload = checked.map((name) => files.find((file) => file.name === name)).map((file) => file?.name);
    let path = $page.url.pathname.split("/").slice(2).join("/");
    progressVisible = true;
    progressText = "Downloading...";
    progressSpeed = "0 KB/s";
    progress = 0;
    downloadMultipleFiles(path, toDownload as string[], (newProgress, speed) => {
      progress = newProgress;
      progressSpeed = convertProgressSpeed(speed);
    }).then(() => {
      progressVisible = false;
    });
  };

  const downloadFile = (file: any) => {
    let path = $page.url.pathname.split("/").slice(2).join("/");
    progressVisible = true;
    progressText = "Downloading...";
    progressSpeed = "0 KB/s";
    progress = 0;

    if(file.dir) {
      downloadMultipleFiles(path, [file.name], (newProgress, speed) => {
        progress = newProgress;
        progressSpeed = convertProgressSpeed(speed);
      }).then(() => {
        progressVisible = false;
      });
    } else {
      downloadSingleFile(path + "/" + file.name, (newProgress, speed) => {
        progress = newProgress;
        progressSpeed = convertProgressSpeed(speed);
      }).then(() => {
        progressVisible = false;
      });
    }
  };

  const uploadFiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = e.target?.files;
      if (files) {
        let path = $page.url.pathname.split("/").slice(2).join("/");
        let names = [...files].map((file) => file.name);
        let res = await checkIfExistMultiple(path, names);
        if(!res) return;
        let count = res.count
        if(count === 0) {
          uploadFilesConfirmed(path, files);
        } else {
          modalType = "confirm";
          modalText = `Are you sure you want to overwrite ${count} file${count > 1 ? "s" : ""}?`;
          modalVisible = true;
          modalConfirm = () => {
            uploadFilesConfirmed(path, files);
            modalVisible = false;
          }
        }
      }
    };
    input.click();
  }

  const uploadFilesConfirmed = (path: string, fileList: FileList) => {
    let files = Array.from(fileList);

    let done = 0;
    let filesProgress: {
      [key: string]: number
    } = {};
    let totalSize = files.reduce((a, b) => a + b.size, 0);

    progressVisible = true;
    progressText = "Uploading...";
    progressSpeed = "0 KB/s";
    progress = 0;
    let lastSpeedValues: number[] = [];

    files.forEach(file => {
      let currentSize = file.size;
      let key = path + file.name;

      uploadCloudFile(path, file, (newProgress, speed) => {
        filesProgress[key] = newProgress * currentSize / totalSize;
        progress = Object.values(filesProgress).reduce((a, b) => a + b, 0);
        lastSpeedValues.push(speed);
        if(lastSpeedValues.length > files.length) lastSpeedValues.shift();
        progressSpeed = convertProgressSpeed(lastSpeedValues.reduce((a, b) => a + b, 0) / lastSpeedValues.length);
      }).then((res) => {
        done++;
        if (done === files.length) {
          reload();
          progressVisible = false;
        };
      });
    })
  }

  const createFolder = () => {
    modalType = "create";
    modalText = "Enter the name of the new folder";
    modalNewName = "";
    modalVisible = true;
    modalConfirm = () => {
      modalVisible = false;
      let path = $page.url.pathname.split("/").slice(2).join("/");
      path = path === "" ? "/" : path + "/";
      createDir(path + "/" + modalNewName).then(() => reload());
    };
  }

  const drop = async (e: any) => {
    dragOver = false;
    
    let items = e.dataTransfer.items;
    let fileItems = []
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.kind === "file") {
        let file = item.webkitGetAsEntry();
        if (file) {
          fileItems.push(file);
        }
      }
    }

    let files: FileUpload[] = [];
    for (let i = 0; i < fileItems.length; i++) {
      let path = $page.url.pathname.split("/").slice(2).join("/");
      path = path === "" ? "" : path + "/";
      let dir_files = await traverse(fileItems[i], path);
      files = [...files, ...dir_files];
    }

    let done = 0;
    let filesProgress: {
      [key: string]: number
    } = {};
    let totalSize = files.reduce((a, b) => a + (b.file ? b.file.size : 0), 0);
    let filesLength = files.reduce((a, b) => a + (b.file ? 1 : 0), 0);

    progressVisible = true;
    progressText = "Uploading...";
    progressSpeed = "0 KB/s";
    progress = 0;
    let lastSpeedValues: number[] = [];
    
    for (let i = 0; i < files.length; i++) {
      if(files[i].isDir) {
        createDir(files[i].path);
      } else {
        let fileData = files[i];
        let file = fileData.file as File;
        let currentSize = file.size;
        let key = fileData.path + file.name;

        uploadCloudFile(files[i].path, file, (newProgress, speed) => {
          filesProgress[key] = newProgress * currentSize / totalSize;
          progress = Object.values(filesProgress).reduce((a, b) => a + b, 0);
          lastSpeedValues.push(speed);
         if(lastSpeedValues.length > files.length) lastSpeedValues.shift();
          progressSpeed = convertProgressSpeed(lastSpeedValues.reduce((a, b) => a + b, 0) / lastSpeedValues.length);
        }).then((res) => {
          done++;
          if (done === filesLength) {
            reload();
            progressVisible = false;
          };
        });
      }
    }
  }

  const traverse = async (entry: any, path: string) => {
    let files: FileUpload[] = [];
    if (entry.isFile) {
      let file: any = await new Promise((resolve) => entry.file(resolve));
      files.push({ path, file, isDir: false });
    } else if (entry.isDirectory) {
      let reader = entry.createReader();
      let dirPath = path === "" ? entry.name : path + "/" + entry.name;
      files.push({ path: dirPath, file: undefined, isDir: true });

      let entries: any = await new Promise((resolve) => reader.readEntries(resolve));
      for (let i = 0; i < entries.length; i++) {
        let dir_path = path === "" ? "" : path + "/";
        let dir_files = await traverse(entries[i], dir_path + entry.name);
        files = [...files, ...dir_files];
      }
    }
    return files;
  }

  const reload = async () => {
    files = (await getFiles($page.url.pathname.split("/").slice(2).join("/"))).files;
  }
</script>

{#if $isValid}
  <div class="container-background" class:drag-over={dragOver}>
    <div class="container scrollbar"
      role="region"
      on:dragenter={() => dragOver = true}
      on:dragover={(e) => {e.preventDefault(); dragOver = true}}
      on:dragleave={() => dragOver = false}
      on:drop|preventDefault={drop}
    >
      <div class="file-header">
        <p class="file-name">Name</p>
        <div class="file-selector">
          {#if checked.length > 0}
            {#if checked.every((name) => files.find((file) => file.name === name)?.write)}
              <button class='bx bx-trash icon' style="color: rgb(200, 0, 0)" on:click={() => deleteFiles()}></button>
            {/if}
            <button class='bx bx-cloud-download icon' on:click={downloadFiles}></button>
          {/if}
          <button class='bx bx-cloud-upload icon' on:click={uploadFiles}></button>
          <button class='bx bx-folder-plus icon' on:click={createFolder}></button>
          <Checkbox onClick={checkAll} checked={files.length === checked.length && files.length > 0} />
        </div>
      </div>
      {#await data.content}
        <Loader />
      {:then content}
        {#if $page.url.pathname !== "/cloud"}
          <div class="file-background">
            <button class="file" on:click={(e) => fileClick(e, { dir: true, name: "..", write: false })}>
              <i class="bx bx-folder"></i>
              <p class="file-name">..</p>
            </button>
          </div>
        {/if}
        {#each files as file}
          <div class="file-background">
            <button class="file" on:click={(e) => fileClick(e, file)}>
              <i class={file.dir ? "bx bx-folder" : "bx bx-file-blank"}></i>
              <p class="file-name">{file.name}</p>
              <div class="file-selector">
                {#if file.write}
                  <button class='bx bx-trash icon' style="color: rgb(200, 0, 0)" on:click|stopPropagation={() => deleteFiles(file)}></button>
                {/if}
                <button class='bx bx-cloud-download icon' on:click|stopPropagation={() => downloadFile(file)}></button>
                <Checkbox onClick={(e) => checkSingle(e, file)} checked={checked.includes(file.name)} />
              </div>
            </button>
          </div>
        {/each}
      {/await}
      {#if progressVisible}
        <div class="progress-container">
          <ProgressBar progress={progress} text={progressText} progressSpeed={progressSpeed} />
        </div>
      {/if}
    </div>
  </div>
  {#if modalVisible}
    <Dialog bind:modalVisible={modalVisible} submit={modalConfirm}>
      {#if modalType === "confirm"}
        <p class="modal-text">{modalText}</p>
        <div class="buttons">
          <Button text="No" onClick={() => modalVisible = false} />
          <Button text="Yes" isSubmit={true} />
        </div>
      {/if}
      {#if modalType === "rename"}
        <p>Are you sure you want to rename the selected file?</p>
        <Button text="No" onClick={() => modalVisible = false} />
        <Button text="Yes" onClick={() => {}} />
      {/if}
      {#if modalType === "create"}
        <p class="modal-text">{modalText}</p>
        <div class="field">
          <input type="text" class="input-field" bind:value={modalNewName} required />
        </div>
        <div class="buttons">
          <Button text="No" onClick={() => modalVisible = false} />
          <Button text="Yes" isSubmit={true} />
        </div>
      {/if}
    </Dialog>
  {/if}
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
    margin: 20px 20px 15px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 600;
    width: calc(100% - 30px);
    height: calc(100% - 35px);
    font-size: 18px;
    box-sizing: border-box;
    background-image: linear-gradient(var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-clip: text;
    background-attachment: fixed;
    color: transparent;
    overflow-y: auto;
  }

  .file-background {
    width: calc(100% - 10px);
    border-radius: 10px;
    padding: 0 5px;
  }

  .file-background:hover {
    background-color: var(--background-color);
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
    box-sizing: border-box;
    background-image: linear-gradient(var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-clip: text;
    background-attachment: fixed;
    color: transparent;
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
    width: calc(100% - 10px);
    height: 30px;
    overflow: hidden;
    border-bottom: 3px solid var(--background-color3);
    margin: 0 5px 5px 5px;
  }

  .file-header .file-selector {
    display: flex;
    flex-direction: row;
  }

  .file-selector button {
    margin-right: 10px;
    font-size: 1.2em;
    cursor: pointer;
  }

  .file-header p {
    margin: 0;
    padding: 0;
    margin-left: 30px;
  }

  .icon {
    background: inherit;
    border: none;
    color: inherit;
    font-size: 1.2em;
    padding: 0;
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

  .buttons {
    display: flex;
    flex-direction: row;
    gap: 5em;
    justify-content: center;
    margin-top: 2em;
  }

  .modal-text {
    text-align: center;
    margin-top: 2em;
    font-size: 1.5em;
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em;
    border: none;
    outline: none;
    color: white;
    background-color: var(--background-color);
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 16em;
    height: 1.5em;
    color: var(--primary-color2);
    font-size: 16px;
  }

  .drag-over {
    background-color: var(--background-color3);
  }

  .progress-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: auto;
    width: 100%;
    height: 35px;
    padding-top: 10px;
  }
</style>