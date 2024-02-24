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
              parser: 'yyyy-MM-dd HH:mm:ss.SSS'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value, index, values) => {
                return value + '%';
              }
            }
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

<canvas class="chart" bind:this={chartCanvas} width="10000" height="10000">
</canvas>

<style>
  .chart {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    border-radius: 10px;
  }
</style>
