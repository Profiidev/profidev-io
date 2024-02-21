<script lang="ts">
  import { pb } from "$lib/auth";
  import { getMetrics } from "$lib/components/data";
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-luxon';
  import { onMount } from "svelte";

  let chart: HTMLCanvasElement;

  onMount(() => {
    getMetrics("Cpu").then((data) => {
      let cores: {
        [key: string]: [number, number][]
      } = data.data;

      let labels = Object.values(cores)[0].map(x => x[0]).map(x => new Date(x * 1000).toISOString().replace("T", " ").replace("Z", ""));
      let datasets: {
        label: string,
        data: number[],
        fill: boolean,
        cubicInterpolationMode: string,
        tension: number
      }[] = [];
      Object.values(cores).forEach((core, i) => {
        let name = Object.keys(cores)[i].toString();
        if(name !== "total") return;
        datasets.push({
          label: name,
          data: core.map(x => x[1]),
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        });
      });

      let myChart = new Chart(chart, {
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
          }
        }
      });
    });
  });
</script>

<div class="card-container">
  <div class="card">
    <canvas class="chart" bind:this={chart} width="10000" height="10000">
    </canvas>
  </div>
</div>

<style>
  .card-container {
    background-image: linear-gradient(163deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    border-radius: 22px;
    transition: all .3s;
    width: 500px;
    height: 500px;
    position: absolute;
    top: 100px;
    left: 100px;
  }

  .card {
    background-color: var(--background-color2);
    border-radius: 20px;
    transition: all .2s;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .card:hover {
    transform: scale(.98);
    border-radius: 20px;
  }

  .chart {
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    border-radius: 10px;
  }
</style>
