import { token } from "$lib/auth"
import { get } from "svelte/store"


export const getMetrics = async (metrics: string, start?: number, end?: number, step?: number) => {
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
