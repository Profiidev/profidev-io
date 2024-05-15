<script lang="ts">
  export let checked = false;
  export let onClick = (e: any) => {};

  let random = Math.random().toString(36).substring(7);
</script>

<button class="container" on:click|stopPropagation>
  <input style="display: none;" id="{random}" type="checkbox" class="cbx" bind:checked={checked} on:click={onClick} />
  <label class="check" for="{random}">
    <svg viewBox="0 0 18 18" height="18px" width="18px">
      <path
        d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"
      ></path>
      <polyline points="1 9 7 14 15 4"></polyline>
    </svg>
  </label>
</button>

<style>
  .container {
    background: inherit;
    color: inherit;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .check {
    cursor: pointer;
    position: relative;
    margin: auto;
    width: 18px;
    height: 18px;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0, 0, 0);
  }

  .check:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(34, 50, 84, 0.03);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .check svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #c8ccd4;
    stroke-width: 1.5;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
  }

  .check svg path {
    stroke-dasharray: 60;
    stroke-dashoffset: 0;
    transition: all 0.3s linear;
  }

  .check svg polyline {
    stroke-dasharray: 22;
    stroke-dashoffset: 66;
    transition: all 0.3s linear;
  }

  .check:hover:before {
    opacity: 1;
  }

  .check:hover svg {
    stroke: lime;
  }

  .cbx:checked + .check svg {
    stroke: lime;
  }

  .cbx:checked + .check svg path {
    stroke-dashoffset: 60;
    transition: all 0.3s linear;
  }

  .cbx:checked + .check svg polyline {
    stroke-dashoffset: 42;
    transition: all 0.2s linear;
    transition-delay: 0.15s;
  }
</style>
