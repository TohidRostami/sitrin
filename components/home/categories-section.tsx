import { Reveal } from "@/components/shared/reveal";
import { CategoriesCarousel } from "@/components/home/categories-slider";
import { getCategories } from "@/lib/queries/categories";

export async function CategoriesSection() {
  const [categories] = await Promise.all([getCategories()]);
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:px-10 md:py-16">
      <Reveal>
        <CategoriesCarousel categories={categories} title={"دسته‌بندی‌ها"} />
      </Reveal>
    </section>
  );
}
