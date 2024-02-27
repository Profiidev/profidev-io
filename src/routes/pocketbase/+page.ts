import type { PageLoad } from "./$types";
import { token } from "$lib/auth";
import { get } from "svelte/store";

export const load: PageLoad = ({ fetch, params }) => {
  let res = fetch("https://api.profidev.io/iframe/pocketbase", {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .then((res) => res.url)
    .catch((e) => {
      return { url: "" };
    });
  return {
    url: res,
  };
};
