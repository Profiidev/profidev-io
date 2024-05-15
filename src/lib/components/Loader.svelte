<script lang="ts">
  export let blur = false;
  export let scale = 1;
</script>

<div class="container" style="--scale: {scale}; {blur ? "backdrop-filter: blur(4px);" : "pointer-events: none;"}">
  <svg height="0" width="0" viewBox="0 0 64 64" class="absolute">
    <defs class="s-xJBuHA073rTt" xmlns="http://www.w3.org/2000/svg">
      <linearGradient class="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="c">
        <stop class="s-xJBuHA073rTt" stop-color="#3700ff"></stop>
        <stop class="s-xJBuHA073rTt" stop-color="#6b21bd" offset="1"></stop>
        <animateTransform repeatCount="indefinite" keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1" keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1" dur="8s" values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32" type="rotate" attributeName="gradientTransform"></animateTransform>
      </linearGradient>
      <linearGradient class="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="d">
        <stop class="s-xJBuHA073rTt" stop-color="#c1584f"></stop>
        <stop class="s-xJBuHA073rTt" stop-color="#ff8000" offset="1"></stop>
      </linearGradient>
    </defs>
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" style="--rotation-duration:0ms; --rotation-direction:normal;" viewBox="0 0 32 64" height="64" width="32" class="inline-block">
    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="8" stroke="url(#d)" d="M9 6H14.5V57.5H9V6Z" class="dash" id="u" pathLength="360"></path>
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" style="--rotation-duration:0ms; --rotation-direction:normal;" viewBox="0 0 64 64" height="64" width="64" class="inline-block">
    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="10" stroke="url(#c)" d="M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54" class="spin" id="o" pathLength="360"></path>
  </svg>
  <div class="w-2"></div>
</div>

<style>
  .container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-box-reflect: below 0 linear-gradient(transparent, transparent, #0005);
    top: 0;
    left: 0;
    user-select: none;
  }

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .absolute {
    position: absolute;
  }

  .inline-block {
    display: inline-block;
  }

  .w-2 {
    width: 0.5em;
  }

  .dash {
    animation: dashArray 2s ease-in-out infinite,
      dashOffset 2s linear infinite;
  }

  .spin {
    animation: spinDashArray 2s ease-in-out infinite,
      spin 8s ease-in-out infinite,
      dashOffset 2s linear infinite;
    transform-origin: center;
  }

  @keyframes dashArray {
    0% {
      stroke-dasharray: 0 1 359 0;
    }

    50% {
      stroke-dasharray: 0 359 1 0;
    }

    100% {
      stroke-dasharray: 359 1 0 0;
    }
  }

  @keyframes spinDashArray {
    0% {
      stroke-dasharray: 270 90;
    }

    50% {
      stroke-dasharray: 0 360;
    }

    100% {
      stroke-dasharray: 270 90;
    }
  }

  @keyframes dashOffset {
    0% {
      stroke-dashoffset: 365;
    }

    100% {
      stroke-dashoffset: 5;
    }
  }

  @keyframes spin {
    0% {
      rotate: 0deg;
    }

    12.5%,
    25% {
      rotate: 270deg;
    }

    37.5%,
    50% {
      rotate: 540deg;
    }

    62.5%,
    75% {
      rotate: 810deg;
    }

    87.5%,
    100% {
      rotate: 1080deg;
    }
  }
</style>
