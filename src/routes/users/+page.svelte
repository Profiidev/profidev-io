<script lang="ts">
  import type { UserColumn } from "$lib/types";
  import { isValid, token } from "$lib/auth";
  import type { PageData } from "./$types";
  import { Permissions } from "$lib/permissions";
  import UsereditModal from "$lib/components/UsereditModal.svelte";
  import { get } from "svelte/store";
  import Loader from "$lib/components/Loader.svelte";

  export let data: PageData;

  let modalVisible = false;
  let columns: UserColumn[] = [
    { label: "Username", width: 200 },
    { label: "Name", width: 200 },
    { label: "Permissions", width: 600 },
    { label: "Admin", width: 80 },
    { label: "", width: 50 }
  ];
  let currentUser = { id: "", username: "", name: "", permissions: [] as string[], admin: false };
  let isEdit = false;
  
  const convertPermissions = (permissions: number) => {
    let permissionArray: string[] = [];
    for(let perm in Permissions) {
      if(!isNaN(Number(perm))) {
        let permission = Number(perm); 
        if((permissions & permission) === permission && permission !== Permissions.Admin) {
          permissionArray.push(Permissions[permission]);
        }
      }
    }
    let permissionString = permissionArray.join(" | ");
    return permissionString || "None";
  };

  const isAdmin = (permissions: number) => {
    return (permissions & Permissions.Admin) === Permissions.Admin;
  };

  const editUser = (user: { id: string, username: string, name: string, permissions: number }) => {
    modalVisible = true;
    currentUser = {
      ...user,
      permissions: Object.keys(Permissions).filter(key => !isNaN(Number(key)) && Number(key) !== Permissions.Admin && (user.permissions & Number(key)) === Number(key)),
      admin: isAdmin(user.permissions),
    };
    isEdit = true;
  };

  const createUser = () => {
    modalVisible = true;
    currentUser = { id: "", username: "", name: "", permissions: [], admin: false };
    isEdit = false;
  };

  const updatedUsers = async () => {
    const res = fetch("https://api.profidev.io/users/get", {
      headers: {
        Authorization: get(token),
      },
    })
      .then((res) => res.json())
      .catch((e) => {
        return [];
      });

    data.users = res;
  };

  const deleteUser = async (user: { id: string }) => {
    fetch("https://api.profidev.io/users/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: get(token),
      },
      body: JSON.stringify({ id: user.id }),
    })
      .then((res) => updatedUsers());
  };
</script>

{#if $isValid}
  <div class="container-background">
    <div class="container scrollbar">
      <div class="columns header">
        <div style="width: 20px;"></div>
        {#each columns as column}
          <div class="column head" style="width: {column.width}px;">
            {column.label}
          </div>
        {/each}
        <div class="column head" style="width: {columns[4].width}px;">
          <button class="button" on:click={createUser} style="color: var(--success-color);">
            <i class='bx bx-plus'></i>
          </button>
        </div>
      </div>
      {#await data.users}
        <Loader />
      {:then users}
        {#each users as user}
          <div class="columns rows">
            <div style="width: 20px;"></div>
            <div class="column row" style="width: {columns[0].width}px;">
              {user.username}
            </div>
            <div class="column row" style="width: {columns[1].width}px;">
              {user.name}
            </div>
            <div class="column row" style="width: {columns[2].width}px;">
              {convertPermissions(user.permissions)}
            </div>
            <div class="column row" style="width: {columns[3].width}px;">
              {isAdmin(user.permissions) ? "Yes" : "No"}
            </div>
            <div class="column" style="width: {columns[4].width}px; color: var(--text-color2);">
              <button class="button" on:click={() => editUser(user)}>
                <i class='bx bx-edit-alt'></i>
              </button>
            </div>
            <div class="column" style="width: {columns[4].width}px; color: var(--error-color);">
              <button class="button" on:click={() => deleteUser(user)}>
                <i class='bx bx-trash'></i>
              </button>
            </div>
          </div>
        {/each}
      {/await}
    </div>
  </div>
  {#if modalVisible}
    <UsereditModal bind:data={currentUser} bind:modalVisible={modalVisible} update={updatedUsers} edit={isEdit}/>
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

  .columns {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
  }

  .rows:hover {
    background-color: var(--background-color);
    border-radius: 10px;
  }

  .column {
    display: flex;
    justify-content: left;
    align-items: center;
    height: 100%;
  }

  .column:nth-child(5) {
    justify-content: center;
    margin-left: auto;
  }

  .row {
    color: var(--text-color2);
  }

  .header {
    border-bottom: 3px solid var(--background-color3);
  }

  .head {
    font-weight: 700;
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

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border-radius: 10px;
    border: 3px solid var(--background-color3);
    background-color: var(--background-color3);
    color: inherit;
  }
</style>