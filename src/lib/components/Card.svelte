<script lang="ts">
  export let currentFullScreen: string;
  export let size: string = "100%";
  export let id: string = "";

  let fullScreen: boolean | undefined = undefined;
  let widthSmaller: boolean = false;
  let lastClick: number = 0;

  $: fullScreen = currentFullScreen === '' ? undefined : currentFullScreen === id;

  const toogleFullScreen = () => {
    currentFullScreen = fullScreen ? '' : id;
  }

  const doubleClick = () => {
    if (lastClick + 300 > Date.now()) {
      toogleFullScreen();
    }
    lastClick = Date.now();
  }

  const singleClick = () => {
    if (fullScreen) {
      toogleFullScreen();
    }
  }

  const resize = () => {
    widthSmaller = window.innerWidth < window.innerHeight;
  }
</script>

<svelte:window on:resize={resize} />

<button class:full-screen-container={fullScreen} class="container" style="--width: {size}; --height: {size};" on:click={singleClick}>
  <button class="card-container" style="--width: {size}; --height: {size}; --fullWidth: 100{widthSmaller ? "vw" : "vh"};" on:click|stopPropagation={doubleClick} class:not-visible={fullScreen !== undefined  && !fullScreen} class:full-screen={fullScreen}>
    <div class="card">
      <slot/>
    </div>
  </button>
</button>

<style>
  .not-visible {
    display: none;
  }

  .container {
    background: transparent;
    border: none;
    display: block;
    width: var(--width);
    height: var(--height);
    margin: 20px;
  }

  .full-screen-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1000;
    margin: 0;
  }

  .full-screen {
    width: calc(var(--fullWidth) - 40px) !important;
    height: calc(var(--fullWidth) - 40px) !important;
  }

  .card-container {
    background-image: linear-gradient(163deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    border-radius: 22px;
    transition: all .5s, margin 0s, transform 0s;
    border: none;
    padding: 0;
    width: var(--width);
    height: var(--height);
    transform: translate(-50%, -50%);
    margin-top: 50%;
    margin-left: 50%;
  }

  .full-screen-container .card-container {
    margin: 0;
    transform: translate(0, 0);
  }

  .card {
    background-color: var(--background-color2);
    border-radius: 20px;
    transition: all .2s;
    transform: scale(1.01);
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
  }

  .card:hover {
    transform: scale(.98);
    border-radius: 20px;
  }
</style>