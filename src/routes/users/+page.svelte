<script lang="ts">
  import type { UserColumn } from "$lib/types";

  let columns: UserColumn[] = [
    { label: "Username", width: 200 },
    { label: "Name", width: 200 },
    { label: "Permissions", width: 200 }
  ];
</script>

<div class="container">
  <div class="columns">
    {#each columns as column}
      <div class="column" style="width: {column.width}px;">
        {column.label}
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(100% - 80px);
    height: calc(100% - 80px);
    margin: 40px;
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    color: transparent;
    background-clip: text;
    font-weight: 600;
    box-sizing: border-box;
  }

  .columns {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid var(--primary-color1);
  }
</style>