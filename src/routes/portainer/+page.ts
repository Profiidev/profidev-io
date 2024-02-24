import type { PageLoad } from "./$types";
import { token } from "$lib/auth";
import { get } from "svelte/store";

export const load: PageLoad = async ({ params }) => {
  let res = await fetch("https://api.profidev.io/iframe/portainer", {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return { url: "" };
    });
  return {
    url: res.url,
  };
};
