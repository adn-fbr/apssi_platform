import { existsSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

import {
  readSupabaseConfiguration,
  SupabaseConfigurationError,
} from "../src/lib/supabase.server.ts";

function reportAuthenticationNotTested() {
  console.log("AUTHENTICATION_NOT_TESTED reason=no-supported-session-flow");
}

let envFileInvalid = false;
const loadLocalEnv = !process.argv.includes("--without-local-env");
if (loadLocalEnv && existsSync(".env.local")) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    console.log("CONFIG_INVALID reason=local_env_file_parse");
    reportAuthenticationNotTested();
    process.exitCode = 1;
    envFileInvalid = true;
  }
}

let configuration;
if (!envFileInvalid) {
  try {
    configuration = readSupabaseConfiguration();
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      if (error.missingVariables.length > 0) {
        console.log(`CONFIG_MISSING missing=${error.missingVariables.join(",")}`);
      } else {
        console.log(`CONFIG_INVALID invalid=${error.invalidVariables.join(",")}`);
      }
    } else {
      console.log("CONFIG_INVALID reason=configuration_validation");
    }
    reportAuthenticationNotTested();
    process.exitCode = 1;
  }
}

if (configuration !== undefined) {
  console.log("CONFIG_VALID");
  let client;
  try {
    client = createClient(configuration.url, configuration.publishableKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
    if (typeof client.auth.getClaims !== "function") {
      throw new Error("Supabase Auth API unavailable.");
    }
  } catch {
    console.log("CONFIG_INVALID reason=supabase_client_configuration");
    reportAuthenticationNotTested();
    process.exitCode = 1;
  }

  if (client !== undefined) {
    const jwksUrl = new URL("/auth/v1/.well-known/jwks.json", configuration.url);
    try {
      const response = await fetch(jwksUrl, {
        headers: {
          Accept: "application/json",
          apikey: configuration.publishableKey,
        },
        signal: AbortSignal.timeout(8000),
      });

      if (response.status >= 500) {
        console.log(`ENDPOINT_UNREACHABLE reason=auth_service_http_${response.status}`);
        process.exitCode = 1;
      } else {
        console.log(`ENDPOINT_REACHABLE http_status=${response.status}`);
      }
    } catch {
      console.log("ENDPOINT_UNREACHABLE reason=network_tls_or_timeout");
      process.exitCode = 1;
    }

    reportAuthenticationNotTested();
  }
}
