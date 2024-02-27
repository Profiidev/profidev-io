<script lang="ts">
  import { Permissions } from "$lib/permissions";
  import { get } from "svelte/store";
  import Multiselect from "./Multiselect.svelte";
  import Toggle from "./Toggle.svelte";
  import { token } from "$lib/auth";

  export let data: {
    id: string,
    username: string,
    name: string,
    permissions: string[],
    admin: boolean,
    password?: string,
    confirmPassword?: string,
  };
  export let modalVisible = false;
  export let update = () => {};

  let error = "";
  let changePassowrd = false;

  const permissionKeys = Object.keys(Permissions).filter(key => !isNaN(Number(key))).map(key => Number(key)).filter(key => key !== Permissions.Admin);

  const save = () => {
    if(data.password !== data.confirmPassword && changePassowrd) {
      error = "Passwords do not match";
      return;
    }
    
    fetch("https://api.profidev.io/users/update", {
      method: "POST",
      headers: {
        Authorization: get(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data.id,
        username: data.username,
        name: data.name,
        permissions: data.permissions.reduce((acc, key) => acc | Number(key), 0) | (data.admin ? Permissions.Admin : 0),
        password: changePassowrd ? data.password : undefined,
        passwordConfirm: changePassowrd ? data.confirmPassword : undefined,
      })
    })
      .then((res) => {
        if (res.ok) {
          modalVisible = false;
          update();
        } else {
          throw new Error("Error");
        }
      })
      .catch((e) => {
        error = "Error while updating user";
      });
  }

  const inputFocus = () => {
    error = "";
  }

  const close = () => {
    modalVisible = false;
  }
</script>

<button class="container" on:click|self={close}>
  <div class="modal-background">
    <div class="modal">
      <form class="form" on:submit|preventDefault={save}>
        <p class="heading">User Edit</p>
        <div class="field">
          <input class="input-field" type="text" required placeholder="Username" bind:value={data.username} on:focus={inputFocus}>
        </div>
        <div class="field">
          <input class="input-field" type="text" required placeholder="Name" bind:value={data.name} on:focus={inputFocus}>
        </div>
        <div class="field">
          <Multiselect bind:value={data.permissions} on:focus={inputFocus} placeholder="Permissions">
            {#each permissionKeys as key}
              <option value={key}>{Permissions[key]}</option>
            {/each}
          </Multiselect>
        </div>
        <Toggle bind:checked={data.admin} onFocus={inputFocus} title={"Admin"}/>
        <Toggle bind:checked={changePassowrd} onFocus={inputFocus} title={"Change Password"}/>
        {#if changePassowrd}
          <div class="field">
            <input class="input-field" type="password" required placeholder="New Password" bind:value={data.password} on:focus={inputFocus}>
          </div>
          <div class="field">
            <input class="input-field" type="password" required placeholder="Confirm Password" bind:value={data.confirmPassword} on:focus={inputFocus}>
          </div>
        {/if}
        {#if error !== ""}
          <p class="error">{error}</p>
        {/if}
        <button class="button" style="--add: {error === "" ? "1" : "0"};" type="submit">Save</button>
      </form>
    </div>
  </div>
</button>

<style>
  .container {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
  }

  .modal-background {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    border-radius: 20px;
    background-image: linear-gradient(163deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
  }

  .modal {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: var(--background-color);
    border-radius: 20px;
    transition: all 0.3s ease;
    transform: scale(1.01);
  }

  .modal:hover {
    transform: scale(0.98);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;
    background-color: var(--background-color2);
    border-radius: 20px;
    align-items: center;
  }

  .error {
    color: var(--error-color);
    height: 1em;
    margin: 0;
  }

  .heading {
    text-align: center;
    margin: 2em;
    color: var(--primary-color1);
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

  .button {
    height: 2.5em;
    width: 9em;
    margin-bottom: 3em;
    margin-top: calc(1em + 2em * var(--add));
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: .4s ease-in-out, margin 0s;
    background-image: linear-gradient(163deg, #6d1fbb 0%, #4b0be6 100%);
    color: rgb(0, 0, 0);
  }

  .button:hover {
    background-image: linear-gradient(163deg, #1c0843 0%, #2a1036 100%);
    color: #9683ff;
  }
</style>