import { PerkGrid } from "@/components/shared/perk-grid";
import { listActiveHeroImages } from "@/lib/queries/settings";
import { Hero } from "@/components/home/hero";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { LimitedSection } from "@/components/home/limited-section";

export default async function HomePage() {
  const [heroImages] = await Promise.all([listActiveHeroImages()]);

  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <LimitedSection url={heroImages[1]?.url} alt={"نسخه محدود"} />
      <PerkGrid />
    </>
  );
}
