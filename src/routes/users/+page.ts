import type { PageLoad } from "./$types";
import { currentUser, token } from "$lib/auth";
import { get } from "svelte/store";
import { Permissions, checkPermission } from "$lib/permissions";

export const load: PageLoad = ({ fetch, params }) => {
  if (!checkPermission(get(currentUser)?.permissions, Permissions.Users)) return { status: 403 };

  let res = fetch("https://api.profidev.io/users/get", {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return [];
    });

  return {
    users: res,
  };
};
