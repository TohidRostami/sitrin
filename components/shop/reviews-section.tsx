import { formatJalaliDate } from "@/lib/format";
import { ReviewForm } from "@/components/shop/review-form";

type ReviewData = { id: string; rating: number; comment: string | null; createdAt: Date; user: { name: string } };

export function ReviewsSection({ productId, reviews }: { productId: string; reviews: ReviewData[] }) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-6 text-2xl font-black">دیدگاه‌های خریداران</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {reviews.length === 0 && (
            <p className="text-sm text-muted">هنوز دیدگاهی برای این محصول ثبت نشده — اولین نفر باشید.</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold">{r.user.name}</span>
                <span className="text-xs text-muted">{formatJalaliDate(r.createdAt)}</span>
              </div>
              <div className="mb-2 text-brand">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              {r.comment && <p className="text-sm leading-7 text-muted">{r.comment}</p>}
            </div>
          ))}
        </div>

        <ReviewForm productId={productId} />
      </div>
    </section>
  );
}
