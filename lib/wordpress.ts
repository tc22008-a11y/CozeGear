export type Product = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  reviewCount: number | null;
  averageRating: number | null;
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  shortDescription?: string | null;
  description?: string | null;
  image: { sourceUrl: string; altText: string } | null;
  galleryImages: { nodes: Array<{ sourceUrl: string; altText: string }> };
  reviews?: {
    nodes: ProductReview[];
  };
};

export type ProductReview = {
  id: string;
  content: string | null;
  date: string | null;
  author: {
    node: {
      name: string | null;
    } | null;
  } | null;
};

export type WordPressPage = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  date: string | null;
};

export type WordPressPost = {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string | null;
  date: string | null;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    } | null;
  } | null;
  author: {
    node: {
      name: string | null;
    } | null;
  } | null;
  categories: {
    nodes: Array<{ name: string; slug: string }>;
  };
};

type StoreApiProduct = {
  id: number;
  name: string;
  slug: string;
  average_rating?: string;
  review_count?: number;
  images?: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
};

const WORDPRESS_GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL || "https://jianx144.sg-host.com/graphql";

const WORDPRESS_STORE_API_URL = "https://jianx144.sg-host.com/wp-json/wc/store/v1/products";

const PRODUCTS_QUERY = `
  query HomeProducts {
    products(first: 4) {
      nodes {
        ...ProductCardFields
      }
    }
  }

  fragment ProductCardFields on Product {
    id
    databaseId
    name
    slug
    type
    status
    reviewCount
    averageRating
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
    }
    image {
      sourceUrl
      altText
    }
    galleryImages(first: 5) {
      nodes {
        sourceUrl
        altText
      }
    }
    reviews(first: 3) {
      nodes {
        id
        content
        date
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

const ALL_PRODUCTS_QUERY = `
  query AllProducts($first: Int = 24) {
    products(first: $first) {
      nodes {
        id
        databaseId
        name
        slug
        type
        status
        reviewCount
        averageRating
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          shortDescription
        }
        image {
          sourceUrl
          altText
        }
        galleryImages(first: 5) {
          nodes {
            sourceUrl
            altText
          }
        }
        reviews(first: 3) {
          nodes {
            id
            content
            date
            author {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_SLUG_QUERY = `
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      type
      status
      reviewCount
      averageRating
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        shortDescription
        description
      }
      image {
        sourceUrl
        altText
      }
      galleryImages(first: 20) {
        nodes {
          sourceUrl
          altText
        }
      }
      reviews(first: 8) {
        nodes {
          id
          content
          date
          author {
            node {
              name
            }
          }
        }
      }
    }
  }
`;

const PAGE_BY_URI_QUERY = `
  query PageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      slug
      content
      date
    }
  }
`;

const POSTS_QUERY = `
  query Posts($first: Int = 12) {
    posts(first: $first) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

const POST_BY_SLUG_QUERY = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      excerpt
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  try {
    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    const json = (await response.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };

    if (json.errors?.length) {
      throw new Error(json.errors.map((error) => error.message).join(", "));
    }

    return json.data || null;
  } catch (error) {
    console.error("Unable to load WordPress GraphQL data", error);
    return null;
  }
}

async function storeApiRequest(params: Record<string, string | number>): Promise<StoreApiProduct[]> {
  try {
    const url = new URL(WORDPRESS_STORE_API_URL);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      throw new Error(`WooCommerce Store API request failed: ${response.status}`);
    }

    return (await response.json()) as StoreApiProduct[];
  } catch (error) {
    console.error("Unable to load WooCommerce Store API products", error);
    return [];
  }
}

function mergeStoreApiProduct(product: Product, storeProduct?: StoreApiProduct): Product {
  if (!storeProduct) {
    return product;
  }

  const storeImages = storeProduct.images || [];
  const uniqueImages = storeImages
    .map((image) => ({ sourceUrl: image.src, altText: image.alt || "" }))
    .filter((image, index, images) => images.findIndex((item) => item.sourceUrl === image.sourceUrl) === index);

  return {
    ...product,
    reviewCount: storeProduct.review_count ?? product.reviewCount,
    averageRating: storeProduct.average_rating ? Number(storeProduct.average_rating) : product.averageRating,
    image: uniqueImages[0] || product.image,
    galleryImages: {
      nodes: uniqueImages.length ? uniqueImages.slice(1) : product.galleryImages.nodes,
    },
  };
}

async function enrichProductsWithStoreApi(products: Product[]): Promise<Product[]> {
  if (!products.length) {
    return products;
  }

  const storeProducts = await storeApiRequest({ per_page: 100 });
  const storeProductMap = new Map(storeProducts.map((product) => [product.id, product]));
  const storeProductSlugMap = new Map(storeProducts.map((product) => [product.slug, product]));

  return products.map((product) =>
    mergeStoreApiProduct(product, storeProductMap.get(product.databaseId) || storeProductSlugMap.get(product.slug)),
  );
}

export async function getHomeProducts(): Promise<Product[]> {
  const data = await graphqlRequest<{ products?: { nodes?: Product[] } }>(PRODUCTS_QUERY);
  return enrichProductsWithStoreApi(data?.products?.nodes || []);
}

export async function getProducts(first = 24): Promise<Product[]> {
  const data = await graphqlRequest<{ products?: { nodes?: Product[] } }>(ALL_PRODUCTS_QUERY, { first });
  return enrichProductsWithStoreApi(data?.products?.nodes || []);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await graphqlRequest<{ product?: Product | null }>(PRODUCT_BY_SLUG_QUERY, { slug });
  const product = data?.product || null;

  if (!product) {
    return null;
  }

  const [storeProduct] = await storeApiRequest({ slug });
  return mergeStoreApiProduct(product, storeProduct);
}

export async function getPageByUri(uri: string): Promise<WordPressPage | null> {
  const data = await graphqlRequest<{ page?: WordPressPage | null }>(PAGE_BY_URI_QUERY, { uri });
  return data?.page || null;
}

export async function getPosts(first = 12): Promise<WordPressPost[]> {
  const data = await graphqlRequest<{ posts?: { nodes?: WordPressPost[] } }>(POSTS_QUERY, { first });
  return data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const data = await graphqlRequest<{ post?: WordPressPost | null }>(POST_BY_SLUG_QUERY, { slug });
  return data?.post || null;
}

export function getProductImage(product: Product): string | null {
  return product.image?.sourceUrl || product.galleryImages.nodes[0]?.sourceUrl || null;
}

export function getProductAlt(product: Product): string {
  return (
    product.image?.altText ||
    product.galleryImages.nodes[0]?.altText ||
    `${product.name} automatic ironing machine product image`
  );
}

export function getProductGallery(product: Product): Array<{ sourceUrl: string; altText: string }> {
  const images = product.image ? [product.image, ...(product.galleryImages.nodes || [])] : product.galleryImages.nodes || [];
  const seen = new Set<string>();

  return images
    .filter((image) => {
      if (seen.has(image.sourceUrl)) {
        return false;
      }

      seen.add(image.sourceUrl);
      return true;
    });
}

export function getProductRating(product: Product): { rating: number; reviewCount: number } {
  return {
    rating: Number(product.averageRating || 0),
    reviewCount: Number(product.reviewCount || 0),
  };
}

export function stripHtml(html?: string | null): string {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getWordPressProductUrl(product: Product): string {
  return `https://jianx144.sg-host.com/product/${product.slug}/`;
}

export function getWordPressAddToCartUrl(product: Product): string {
  return `https://jianx144.sg-host.com/cart/?add-to-cart=${product.databaseId}`;
}
