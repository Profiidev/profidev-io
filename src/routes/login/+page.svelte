<script lang="ts">
  import { pb, isValid } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import Loader from "$lib/components/Loader.svelte";
  import { lastUrl } from "$lib/stores";

  let username = "";
  let password = "";
  let showLoader = false;
  let error = "";

  onMount(() => {
    if(get(isValid)) {
      goto($lastUrl);
      lastUrl.set("/");
    }
  });

  const login = async () => {
    error = "";
    showLoader = true;
    const user = await pb.collection("users").authWithPassword(username, password).catch(e => {
      password = "";
      error = "Error while logging in. Please try again."
    });
    if(user) {
      username = "";
      password = "";
      goto($lastUrl);
      lastUrl.set("/");
    }
    showLoader = false;
  }

  const inputFocus = () => {
    error = "";
  }
</script>

<div class="container">
  <div class="card">
    <div class="card2">
      <form class="form" on:submit={login}>
        <p class="heading">Login</p>
        <div class="field">
          <input type="text" class="input-field" placeholder="Username" autocomplete="off" bind:value={username} on:focus={inputFocus}>
        </div>
        <div class="field">
          <input type="password" class="input-field" placeholder="Password" bind:value={password} on:focus={inputFocus}>
        </div>
        {#if error !== ""}
          <p class="error">{error}</p>
        {/if}
        <button class="button" style="--add: {error === "" ? "1" : "0"};">Login</button>
      </form>
    </div>
  </div>
</div>
{#if showLoader}
  <Loader blur={true} scale={.75} />
{/if}

<style>
  .container {
    height: 100%;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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
    font-size: 1.2em;
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
    transition: .4s ease-in-out;
    background-image: linear-gradient(163deg, #6d1fbb 0%, #4b0be6 100%);
    color: rgb(0, 0, 0);
  }

  .button:hover {
    background-image: linear-gradient(163deg, #1c0843 0%, #2a1036 100%);
    color: #9683ff;
  }

  .card {
    background-image: linear-gradient(163deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    border-radius: 22px;
    transition: all .3s;
    width: 20em;
  }

  .card2 {
    border-radius: 0;
    transition: all .2s;
  }

  .card2:hover {
    transform: scale(0.98);
    border-radius: 20px;
  }

  .card:hover {
    box-shadow: 0px 0px 30px 1px var(--primary-shadow);	
  }
</style>