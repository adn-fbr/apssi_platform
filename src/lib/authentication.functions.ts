import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { emailPasswordCredentialsSchema } from "./authentication.schema";
import {
  getAuthenticationState,
  signInWithEmailPassword,
  signOutCurrentSession,
} from "./authentication.server";

export const getAuthenticationStateFn = createServerFn({ method: "GET" }).handler(() =>
  getAuthenticationState(getRequest()),
);

export const signInWithEmailPasswordFn = createServerFn({ method: "POST" })
  .validator(emailPasswordCredentialsSchema)
  .handler(({ data }) => signInWithEmailPassword(getRequest(), data.email, data.password));

export const signOutCurrentSessionFn = createServerFn({ method: "POST" }).handler(() =>
  signOutCurrentSession(getRequest()),
);
