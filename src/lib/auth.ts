import PocketBase from "pocketbase";
import { writable } from "svelte/store";

export const pb = new PocketBase("https://pocketbase.profidev.io/");
export const currentUser = writable(pb.authStore.model);
export const token = writable(pb.authStore.token);
export const isValid = writable(pb.authStore.isValid);

pb.authStore.onChange((auth) => {
  currentUser.set(pb.authStore.model);
  token.set(pb.authStore.token);
  isValid.set(pb.authStore.isValid);
});
