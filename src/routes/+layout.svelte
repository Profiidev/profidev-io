<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { isValid, pb } from "$lib/auth";
  import { goto } from "$app/navigation";
  import Navbar from "$lib/components/Navbar.svelte";
  import { lastUrl } from "$lib/stores";

  onMount(() => {
    if(!get(isValid)) {
      if(location.pathname !== "/login") {
        lastUrl.set(location.pathname);
        goto("/login");
      }
    } else {
      pb.collection("users").authRefresh().catch(e => {
        pb.authStore.clear();
        lastUrl.set(location.pathname);
        goto("/login");
      });
    }
  })
</script>

<Navbar />
<div class="container">
  <slot />
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
  :global(:root) {
    --primary-color1: #ff8000;
    --primary-shadow1: rgba(255, 153, 0, 0.3);
    --secondary-color1: #6e3700;

    --primary-color2: #913a8d;

    --primary-color3: #3700ff;
    --secondary-color3: #1a0077;

    --error-color: #ff0000;

    --background-color: #161819;
    --background-color2: #0F1011;
    --background-color3: #070708;

    font-family: "Poppins" , sans-serif;
  }

  .container {
    position: absolute;
    height: 100%;
    width: calc(100% - 78px);
    left: 78px;
    background-color: var(--background-color);
  }
</style>