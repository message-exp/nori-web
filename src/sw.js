/* eslint-env serviceworker */
/* global self */
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { clientsClaim } from "workbox-core";

clientsClaim();

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

let allowlist;
if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }),
);
