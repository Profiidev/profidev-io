<script lang="ts">
  import { pb } from "$lib/auth";

  const logout = () => {
    pb.authStore.clear();
  }
</script>

<button on:click={logout}>Logout</button>
<a href="/login">Login</a>
