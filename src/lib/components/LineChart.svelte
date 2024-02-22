<script lang="ts">
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-luxon';
  import { onMount } from "svelte";

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

  export let labels: string[] = [];
  export let datasets: {
    label: string,
    data: number[],
    fill: boolean,
    cubicInterpolationMode: string,
    tension: number
  }[] = [];
  export let size: string = "100%";
  export let header: string = "Line Chart";

  $: labels, datasets, createChart();

  const createChart = () => {
    if(chart === undefined) return;
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
  }

  onMount(() => {
    chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        //@ts-ignore
        datasets: datasets
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              parser: 'yyyy-MM-dd HH:mm:ss.SSS',
            }
          },
          y: {
            beginAtZero: true
          },
        },
        plugins: {
          title: {
            display: true,
            text: header,
            color: 'lightgray',
            font: {
              size: 15,
              family: 'Poppins'
            }
          },
        }
      }
    });
    createChart();
  });
</script>

<div class="card-container" style="width: {size}; height: {size};">
  <div class="card" style="width: {size}; height: {size};">
    <canvas class="chart" bind:this={chartCanvas} width="10000" height="10000">
    </canvas>
  </div>
</div>

<style>
  .card-container {
    background-image: linear-gradient(163deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    border-radius: 22px;
    transition: all .3s;
    margin: 20px;
  }

  .card {
    background-color: var(--background-color2);
    border-radius: 20px;
    transition: all .2s;
    transform: translateY(-2%) scale(1.01);
  }

  .card:hover {
    transform: scale(.98) translateY(-2%);
    border-radius: 20px;
  }

  .chart {
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    border-radius: 10px;
  }
</style>
