import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { getProductAlt, getProductGallery, getProductRating, type Product } from "@/lib/wordpress";

export function ProductCard({ product }: { product: Product }) {
  const gallery = getProductGallery(product);
  const image = gallery[0];
  const hoverImage = gallery[1];
  const { rating, reviewCount } = getProductRating(product);

  return (
    <article className="group overflow-hidden rounded border border-[var(--line)] bg-white">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] bg-[var(--soft)]">
        {image ? (
          <>
            <Image
              src={image.sourceUrl}
              alt={image.altText || getProductAlt(product)}
              fill
              sizes="(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            {hoverImage ? (
              <Image
                src={hoverImage.sourceUrl}
                alt={hoverImage.altText || getProductAlt(product)}
                fill
                sizes="(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-0 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="grid h-full place-items-center text-sm text-[var(--muted)]">Product image</div>
        )}
      </Link>
      <div className="p-4">
        <h3 className="min-h-12 text-base font-semibold leading-6">
          <Link href={`/products/${product.slug}`} className="hover:text-[var(--accent)]">
            {product.name}
          </Link>
        </h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <div className="flex text-[var(--accent)]" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star fill={index < Math.round(rating) ? "currentColor" : "none"} size={15} strokeWidth={1.4} key={index} />
            ))}
          </div>
          <span>{rating.toFixed(1)}</span>
          <span>({reviewCount})</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-[var(--accent)]">{product.salePrice || product.price}</span>
          {product.regularPrice && product.salePrice && product.regularPrice !== product.salePrice ? (
            <span className="text-sm text-[var(--muted)] line-through">{product.regularPrice}</span>
          ) : null}
        </div>
        <Link href={`/products/${product.slug}`} className="focus-ring mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded bg-[var(--accent)] text-sm font-semibold text-white hover:bg-[var(--accent-strong)]">
          View product <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
