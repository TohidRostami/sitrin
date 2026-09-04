import { listCategoriesWithCounts } from "@/lib/queries/categories";
import { Header } from "./header";

export async function ServerHeader() {
  const [categories] = await Promise.all([listCategoriesWithCounts()]);
  return <Header categories={categories} />;
}
