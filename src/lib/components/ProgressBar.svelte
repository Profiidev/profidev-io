<script lang="ts">
  export let progress: number = 0;
  export let text = "Progress";
  export let progressSpeed = "0 KB/s";
</script>

<div class="container">
  <p class="text">{text}</p>
  <p class="speed">{progressSpeed}</p>
  <div class="progress-loader">
    <div class="progress" style="width: {progress}%;"></div>
  </div>
</div>

<style>
  .container {
    width: 100%;
    display: grid;
    height: 100%;
    grid-template-areas: "text speed" "progress progress";
    gap: 2px;
  }

  p {
    margin: 0;
    font-size: 17px;
  }

  .text {
    grid-area: text;
    text-align: left;
    padding-left: 5px;
  }

  .speed {
    grid-area: speed;
    text-align: right;
    padding-right: 5px;
  }

  .progress-loader {
    background: var(--background-color);
    width: 100%;
    height: 10px;
    border-radius: 7px;
    grid-area: progress;
  }

  .progress {
    width: 1px;
    height: 10px;
    border-radius: 7px;
    background: var(--primary-color3);
    transition: 0.5s;
  }
</style>