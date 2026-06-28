/**
 * Server functions for reading projects. Safe to call from route loaders — the
 * server-only store code is stripped from the client bundle by createServerFn.
 */
import { createServerFn } from "@tanstack/react-start";
import { listProjects } from "./store.server";

export const fetchProjects = createServerFn({ method: "GET" }).handler(async () => {
  return listProjects();
});
