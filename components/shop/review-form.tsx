"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/lib/actions/review";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  if (!session) {
    return (
      <div className="h-fit rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-muted">
        برای ثبت دیدگاه ابتدا{" "}
        <a href="/login" className="text-brand-hover">
          وارد حساب کاربری‌تان
        </a>{" "}
        شوید.
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitReview({ productId, rating, comment });
      if (result.ok) {
        toast.success(result.message);
        setComment("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 text-sm font-bold">دیدگاه خود را بنویسید</div>
      <div className="mb-4 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} className="text-brand">
            <Star className="h-6 w-6" fill={n <= rating ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="تجربه‌تان را با دیگران به اشتراک بگذارید…"
        className="mb-3 min-h-[100px]"
      />
      <Button type="submit" disabled={pending} className={cn("w-full")} size="sm">
        ثبت دیدگاه
      </Button>
    </form>
  );
}
