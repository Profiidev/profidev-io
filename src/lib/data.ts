import { token } from "$lib/auth"
import { get } from "svelte/store"
import type { Dataset } from "./types";
import { DateTime } from "luxon";

const getMetrics = async (metrics: string, start?: number, end?: number, step?: number) => {
  let utc = new Date().getTimezoneOffset() * 60000;
  return fetch("https://api.profidev.io/metrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: get(token),
    },
    body: JSON.stringify({
      start: start || Date.now() + utc - 3600000,
      end: end || Date.now() + utc,
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

    let labels = Object.values(cores)[0]
      .map((x) => x[0])
      .map((x) => new Date(x * 1000).toISOString());
    
    let datasets: Dataset[] = [];
    Object.values(cores).forEach((core, i) => {
      let name = Object.keys(cores)[i].toString();
      if (name !== "total" && onlyTotal) return;
      datasets.push({
        label: name,
        data: core.map((x) => x[1]),
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      });
    });

    return { labels, datasets };
  });
};

export const getMemoryDataset = async (start?: number, end?: number, step?: number) => {
  return getMetrics("Memory", start, end, step).then((data) => {
    let memory: {
      [key: string]: [number, number][]
    } = data.data;

    let labels = Object.values(memory)[0]
      .map((x) => x[0])
      .map((x) => new Date(x * 1000).toISOString());
    
    let datasets: Dataset[] = [];
    Object.values(memory).forEach((mem, i) => {
      let name = Object.keys(memory)[i].toString();
      datasets.push({
        label: name,
        data: mem.map((x) => x[1]),
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      });
    });

    return { labels, datasets };
  });
};

export const getNetworkDatasets = async (start?: number, end?: number, step?: number) => {
  return getMetrics("Network", start, end, step).then((data) => {
    let network: {
      [key: string]: [number, number][]
    } = data.data;

    let labels = Object.values(network)[0]
      .map((x) => x[0])
      .map((x) => new Date(x * 1000).toISOString());
    
    let datasets: Dataset[] = [];
    Object.values(network).forEach((net, i) => {
      let name = Object.keys(network)[i].toString();
      datasets.push({
        label: name,
        data: net.map((x) => x[1]),
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      });
    });

    return { labels, datasets };
  });
};

export const getDiskDataset = async (start?: number, end?: number, step?: number) => {
  return getMetrics("Disk", start, end, step).then((data) => {
    let disk: {
      [key: string]: [number, number][]
    } = data.data;

    let labels = Object.values(disk)[0]
      .map((x) => x[0])
      .map((x) => new Date(x * 1000).toISOString());
    
    let datasets: Dataset[] = [];
    Object.values(disk).forEach((d, i) => {
      let name = Object.keys(disk)[i].toString();
      datasets.push({
        label: name,
        data: d.map((x) => x[1] / 1024 / 1024 / 1024),
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      });
    });

    return { labels, datasets };
  });
};

export const convertTime = (time: string) => {
  return DateTime.fromISO(time).setZone("local").toISO({ includeOffset: false })?.replace("T", " ").replace("Z", "") || "";
};