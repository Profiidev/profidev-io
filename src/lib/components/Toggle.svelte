<script lang="ts">
  export let checked = false;
  export let title = "Toggle";
  export let onFocus = () => {};
</script>

<div class="toggle-field">
  <label class="toggle-switch">
    <input type="checkbox" bind:checked={checked}  on:focus={onFocus}>
    <div class="toggle-switch-background">
      <div class="toggle-switch-handle"></div>
    </div>
  </label>
  <p class="toggle-text">{title}</p>
</div>

<style>
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
    cursor: pointer;
  }

  .toggle-switch input[type="checkbox"] {
    display: none;
  }

  .toggle-switch-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background-color);
    border-radius: 20px;
    transition: background-color 0.3s ease-in-out;
  }

  .toggle-switch-handle {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    background-color: var(--primary-color2);
    border-radius: 50%;
    transition: transform 0.3s ease-in-out;
  }

  .toggle-switch::before {
    content: "";
    position: absolute;
    top: -25px;
    right: -30px;
    font-size: 12px;
    font-weight: bold;
    transition: color 0.3s ease-in-out;
  }

  .toggle-switch input[type="checkbox"]:checked + .toggle-switch-background {
    background-color: var(--secondary-color2);
  }

  .toggle-switch input[type="checkbox"]:checked + .toggle-switch-background .toggle-switch-handle {
    transform: translateX(30px);
  }
  
  .toggle-field {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    border-radius: 25px;
    padding: 0 0.6em;
    font-size: 16px;
    width: 16em;
    gap: 1em;
  }

  .toggle-text {
    color: var(--primary-color2);
  }
</style>