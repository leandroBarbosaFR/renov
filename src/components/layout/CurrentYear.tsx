import { cacheLife } from "next/cache";

/** Current year, server-rendered and refreshed daily. */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
