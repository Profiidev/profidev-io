import type { PageLoad } from "./$types";
import { token } from "$lib/auth";
import { get } from "svelte/store";

export const load: PageLoad = async () => {
  let res = await fetch("https://api.profidev.io/images/apod", {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.text())
    .catch((e) => {
      return "";
    });
  
  return {
    apod: res,
  };
};
