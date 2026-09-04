import Link from "next/link";
import { ProductImage } from "@/components/shared/product-image";
import { PriceTag } from "@/components/shared/price-tag";
import { productTag, type ProductCardData } from "@/lib/queries/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: ProductCardData; className?: string }) {
  const tag = productTag(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[20px] border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-brand",
        className
      )}
    >
      <div className="relative aspect-[4/5] bg-surface-sunken">
        <ProductImage src={product.images[0]?.url} alt={product.images[0]?.alt ?? product.name}/>
        {tag && (
          <span className="absolute top-3 right-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-extrabold text-ink">
            {tag.label}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold text-muted">{product.category.title}</span>
        <span className="text-[14.5px] font-bold leading-6">{product.name}</span>
        <div className="mt-auto pt-1">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
        </div>
      </div>
    </Link>
  );
}


