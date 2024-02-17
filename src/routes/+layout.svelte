<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { isValid } from "$lib/auth";
  import { goto } from "$app/navigation";
  import Navbar from "$lib/components/Navbar.svelte";

  onMount(() => {
    if(!get(isValid)) {
      goto("/login");
    }
  })
</script>

<Navbar />
<div class="container">
  <slot />
</div>

<style>
  :global(:root) {
    --primary-color1: #ff8000;
    --primary-shadow1: rgba(255, 153, 0, 0.3);
    --secondary-color1: #6e3700;

    --primary-color2: #913a8d;

    --primary-color3: #3700ff;
    --secondary-color3: #1a0077;

    --error-color: #ff0000;

    --background-color: #212121;
    --background-color2: #141414;
    --background-color3: #070708;
  }

  .container {
    position: absolute;
    height: 100vh;
    max-width: calc(100vw - 78px);
    left: 78px;
    overflow: hidden;
    background-color: var(--background-color);
  }
</style>