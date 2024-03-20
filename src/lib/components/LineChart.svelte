<script lang="ts">
  import type { Dataset } from '$lib/types';
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-luxon';
  import { onMount } from "svelte";
  import { convertTime } from '$lib/data';

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;
  let startDateTime: string = convertTime(new Date(Date.now() - 3600000).toISOString()).slice(0, 16);
  let endDateTime: string = convertTime(new Date(Date.now()).toISOString()).slice(0, 16);
  let dataPoints: number = 60;

  export let header: string = "Line Chart";
  export let simple: boolean = true;
  export let unit: string = '%';
  export let load: (start: number, end: number, step: number) => Promise<{labels: string[], datasets: Dataset[]}>;

  $: startDateTime, endDateTime, dataPoints, dataLoad();

  const dataLoad = async () => {
    if(chart === undefined || chart.data.labels === undefined || chart.data.datasets === undefined) return;

    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();
    dataPoints = dataPoints < 1 ? 1 : dataPoints;
    let step = (end - start) / 60000 / dataPoints;
    step = step < 1 ? 1 : Math.round(step);

    let unit = 'minute';
    let minDiff = (end - start) / 60000;
    if (minDiff < 360) {
      unit = 'minute';
    } else if (minDiff < 5000) {
      unit = 'hour';
    } else if (minDiff < 20080) {
      unit = 'day';
    } else if (minDiff < 438000) {
      unit = 'week';
    }

    if(chart.options.scales !== undefined && chart.options.scales.x !== undefined) {
      //@ts-expect-error
      chart.options.scales.x.time.unit = unit;
    }
    
    let labels = chart.data.labels.length;
    for(let i = 0; i < labels; i++) {
      chart.data.labels.pop();
    }
    chart.data.datasets.forEach(dataset => {
      let data = dataset.data.length;
      for(let i = 0; i < data; i++) {
        dataset.data.pop();
      }
    });
    
    const data = await load(start, end, step);
    
    if(chart.data.labels.length === 0) {
      chart.data.labels = data.labels.map(label => convertTime(label));
    } else {
      data.labels.forEach(label => convertTime(label));
    }
    
    if(chart.data.datasets.length === 0) {
      chart.data.datasets = data.datasets;
    } else {
      data.datasets.forEach(dataset => {
        dataset.data.forEach(data => {
          chart.data.datasets.find(d => d.label === dataset.label)?.data.push(data);
        });
      });
    }

    if(chart.options.scales !== undefined && chart.options.scales.x !== undefined) {
      //@ts-expect-error
      chart.options.scales.x.min = new Date(start);
      //@ts-expect-error
      chart.options.scales.x.max = new Date(end);
    }
    
    chart.update();
  };

  const createChart = () => {
    if(chart === undefined) return;
    setInterval(dataLoad, 60000);
  }

  onMount(() => {
    chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              parser: 'yyyy-MM-dd HH:mm:ss.SSS',
              displayFormats: {
                minute: 'HH:mm'
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value, index, values) => {
                return value + unit;
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
    dataLoad();
  });
</script>

<div class="container" style="--simple: {simple ? 1 : 0};">
  <canvas class="chart" bind:this={chartCanvas} width="10000" height="10000">
  </canvas>
  {#if !simple}
    <div class="options">
      <input type="datetime-local" bind:value={startDateTime}>
      <input type="number" bind:value={dataPoints} min="1" max="100">
      <input type="datetime-local" bind:value={endDateTime}>
    </div>
  {/if}
</div>

<style>
  .container {
    width: calc(100% - 20px);
    height: calc(100% - 40px + (var(--simple) * 20px));
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }

  .options {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  input {
    width: 150px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--background-color);
    border: none;
    color: var(--text-color1);
  }

  input[type="number"] {
    width: 10%;
  }
</style>
