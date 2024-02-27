import type { PageLoad } from "./$types";
import { token } from "$lib/auth";
import { get } from "svelte/store";

export const load: PageLoad = async ({ fetch, params }) => {
  let res = await fetch("https://api.profidev.io/iframe/portainer", {
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
