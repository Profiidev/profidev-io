import { token } from "$lib/auth"
import { get } from "svelte/store"
import type { Dataset } from "./types";


const getMetrics = async (metrics: string, start?: number, end?: number, step?: number) => {
  return fetch("https://api.profidev.io/metrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: get(token),
    },
    body: JSON.stringify({
      start: start || Math.floor(Date.now() / 1000) - 3600,
      end: end || Math.floor(Date.now() / 1000),
      step: step || 1,
      metrics: metrics,
    }),
  }).then((response) => response.json());
};

export const getCpuDatasets = async (onlyTotal: boolean, start?: number, end?: number, step?: number) => {
  return getMetrics("Cpu", start, end, step).then((data) => {
    let cores: {
      [key: string]: [number, number][]
    } = data.data;

    let timeLabels = Object.values(cores)[0]
      .map((x) => x[0])
      .map((x) => new Date(x * 1000).toISOString().replace("T", " ").replace("Z", ""));
    
    let cpuDatasets: Dataset[] = [];
    Object.values(cores).forEach((core, i) => {
      let name = Object.keys(cores)[i].toString();
      if (name !== "total" && onlyTotal) return;
      cpuDatasets.push({
        label: name,
        data: core.map((x) => x[1]),
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      });
    });

    return { timeLabels, cpuDatasets };
  });
}

export const getMemoryDataset = async (start?: number, end?: number, step?: number) => {
  return getMetrics("Memory", start, end, step).then((data) => {
    let memory: {
      [key: string]: [number, number][]
    } = data.data;
    
    let memoryDataset: Dataset[] = [];
    Object.values(memory).forEach((mem, i) => {
      let name = Object.keys(memory)[i].toString();
      memoryDataset.push({
        label: name,
        data: mem.map((x) => x[1]),
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      });
    });

    return memoryDataset;
  });
}