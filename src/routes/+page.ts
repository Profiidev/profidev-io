import type { PageLoad } from "./$types";
import { token } from "$lib/auth";
import { get } from "svelte/store";

export const load: PageLoad = ({ fetch, params }) => {
  let res = fetch("https://api.profidev.io/images/apod", {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return {};
    });

  return res;
};
