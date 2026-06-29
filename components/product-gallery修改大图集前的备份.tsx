"use client";

import { useId, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

type ProductGalleryProps = {
  images: Array<{ sourceUrl: string; altText: string }>;
  fallbackAlt: string;
};

export function ProductGallery({ images, fallbackAlt }: ProductGalleryProps) {
  const visibleImages = images;
  const thumbsRef = useRef<HTMLDivElement>(null);
  const galleryId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const cssRules = visibleImages
    .map(
      (_, index) => `
        #${galleryId}-image-${index}:checked ~ .product-gallery-main [data-gallery-panel="${index}"] {
          opacity: 1;
          pointer-events: auto;
          z-index: 2;
        }

        #${galleryId}-image-${index}:checked ~ .product-gallery-thumbs [data-gallery-thumb="${index}"] {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }
      `,
    )
    .join("\n");

  const scrollThumbs = (direction: "up" | "down") => {
    thumbsRef.current?.scrollBy({
      top: direction === "up" ? -156 : 156,
      behavior: "smooth",
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[144px_minmax(0,1fr)] lg:items-stretch">
      <style>{cssRules}</style>

      {visibleImages.map((_, index) => (
        <input
          type="radio"
          className="sr-only"
          id={`${galleryId}-image-${index}`}
          name={`${galleryId}-product-gallery`}
          defaultChecked={index === 0}
          key={`${galleryId}-radio-${index}`}
        />
      ))}

      <div className="product-gallery-thumbs relative order-2 lg:order-1 lg:h-full">
        {visibleImages.length > 4 ? (
          <button
            type="button"
            className="focus-ring absolute left-1/2 top-2 z-20 hidden h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-[var(--foreground)] shadow-md backdrop-blur hover:bg-white lg:grid"
            onClick={() => scrollThumbs("up")}
            aria-label="Scroll thumbnails up"
          >
            <ChevronUp size={20} />
          </button>
        ) : null}

        <div ref={thumbsRef} className="scrollbar-hidden grid max-h-[315px] grid-cols-4 content-start gap-3 overflow-y-auto pr-1 lg:h-full lg:max-h-[860px] lg:grid-cols-1 lg:auto-rows-[144px] lg:pr-1">
          {visibleImages.map((image, index) => (
            <label
              className="focus-ring relative z-10 aspect-square min-h-11 cursor-pointer touch-manipulation overflow-hidden rounded border border-[var(--line)] bg-[var(--soft)] lg:aspect-auto lg:h-36"
              htmlFor={`${galleryId}-image-${index}`}
              aria-label={`View product image ${index + 1}`}
              data-gallery-thumb={index}
              tabIndex={0}
              key={`${image.sourceUrl}-${index}`}
            >
              <img src={image.sourceUrl} alt={image.altText || fallbackAlt} className="pointer-events-none absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </label>
          ))}
        </div>

        {visibleImages.length > 4 ? (
          <button
            type="button"
            className="focus-ring absolute bottom-2 left-1/2 z-20 hidden h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-[var(--foreground)] shadow-md backdrop-blur hover:bg-white lg:grid"
            onClick={() => scrollThumbs("down")}
            aria-label="Scroll thumbnails down"
          >
            <ChevronDown size={20} />
          </button>
        ) : null}
      </div>

      <div className="product-gallery-main relative order-1 aspect-[4/5] overflow-hidden rounded bg-[var(--soft)] lg:order-2 lg:max-h-[860px]">
        {visibleImages.length ? (
          visibleImages.map((image, index) => {
            const previousIndex = index === 0 ? visibleImages.length - 1 : index - 1;
            const nextIndex = index === visibleImages.length - 1 ? 0 : index + 1;

            return (
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-150"
                data-gallery-panel={index}
                key={`${image.sourceUrl}-panel-${index}`}
              >
                <img
                  src={image.sourceUrl}
                  alt={image.altText || fallbackAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {visibleImages.length > 1 ? (
                  <>
                    <label
                      className="focus-ring absolute left-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 cursor-pointer touch-manipulation place-items-center rounded-full bg-white/90 text-[var(--foreground)] shadow-md backdrop-blur hover:bg-white"
                      htmlFor={`${galleryId}-image-${previousIndex}`}
                      aria-label="Previous product image"
                      tabIndex={0}
                    >
                      <ChevronLeft size={24} />
                    </label>
                    <label
                      className="focus-ring absolute right-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 cursor-pointer touch-manipulation place-items-center rounded-full bg-white/90 text-[var(--foreground)] shadow-md backdrop-blur hover:bg-white"
                      htmlFor={`${galleryId}-image-${nextIndex}`}
                      aria-label="Next product image"
                      tabIndex={0}
                    >
                      <ChevronRight size={24} />
                    </label>
                  </>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="grid h-full place-items-center text-sm text-[var(--muted)]">Product image</div>
        )}
      </div>
    </div>
  );
}
