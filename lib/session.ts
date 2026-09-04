import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** برای استفاده در Server Component ها و Server Action ها. */
export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireServerSession() {
  const session = await getServerSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}
