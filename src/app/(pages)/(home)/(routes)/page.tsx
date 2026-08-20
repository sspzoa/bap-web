import { redirect } from "next/navigation";
import { SITE_HOME } from "@/sites/home";
import { getSiteId } from "@/sites/server";

export default async function Page() {
  const siteId = await getSiteId();
  if (!siteId) {
    redirect("/select");
  }

  return SITE_HOME[siteId]();
}
