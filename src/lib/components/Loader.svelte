<script lang="ts">
  export let blur = false;
  export let scale = 1;
</script>

<div class="container" style="--scale: {scale}; {blur ? "backdrop-filter: blur(4px);" : "pointer-events: none;"}">
  <div class="loader"><span></span></div>
  <div class="loader"><span></span></div>
  <div class="loader"><i></i></div>
  <div class="loader"><i></i></div>
</div>

<style>
  .container {
    position: absolute;
    max-width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-box-reflect: below 0 linear-gradient(transparent, transparent, #0005);
    top: 0;
    left: 0;
    user-select: none;
  }

  .container .loader {
    position: absolute;
    width: calc(150px * var(--scale));
    height: calc(150px * var(--scale));
    border-radius: 50%;
    animation: animate 2s linear infinite;
  }

  .container .loader:nth-child(2),
  .container .loader:nth-child(4) {
    animation-delay: -1s;
  }

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .container .loader:nth-child(1) {
    --color: rgba(255, 145, 0, 0.4);
  }

  .container .loader:nth-child(2) {
    --color: rgba(76, 0, 255, 0.4);
  }

  .container .loader:nth-child(1)::before,
  .container .loader:nth-child(2)::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to top, transparent, var(--color));
    background-size: 100px 180px;
    background-repeat: no-repeat;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
  }

  .container .loader:nth-child(3) i {
    --color: #ff8000;
  }

  .container .loader:nth-child(4) i {
    --color: #3700ff;
  }

  .container .loader i {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background: var(--color);
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 0 10px var(--color),
      0 0 30px var(--color),
      0 0 40px var(--color),
      0 0 50px var(--color),
      0 0 60px var(--color),
      0 0 70px var(--color),
      0 0 80px var(--color),
      0 0 90px var(--color),
      0 0 100px var(--color);
  }

  .container .loader span {
    position: absolute;
    inset: 20px;
    background: #191B1C;
    border-radius: 50%;
    z-index: 1;
  }
</style>