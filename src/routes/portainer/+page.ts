import type { PageLoad } from "./$types";
import { token, currentUser } from "$lib/auth";
import { get } from "svelte/store";
import { Permissions, checkPermission } from "$lib/permissions";

export const load: PageLoad = async ({ fetch, params }) => {
  if (!checkPermission(get(currentUser)?.permissions, Permissions.Portainer)) return { status: 403 };
  
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
