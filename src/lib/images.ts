import { get } from "svelte/store";
import { token } from "./auth";

export const getAPOD = async () => {
  return fetch("https://api.profidev.io/images/apod", {
    headers: {
      Authorization: get(token)
    }
  }).then(res => {
    return res.text();
  })
}