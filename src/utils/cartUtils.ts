import { ICartItem } from "@/store/cartSlice";

export interface IBackendCartItem {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  price: number;
  quantity: number;
  image: string;
  isSale: boolean;
  salePercent: number;
  inStock: boolean;
}

export const convertToBackendItem = (item: ICartItem): IBackendCartItem => {
  return {
    id: item.slug, // Use slug as id for now
    slug: item.slug,
    title: item.title,
    categories: [], // Will be populated by backend
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    isSale: item.originalPrice ? item.originalPrice > item.price : false,
    salePercent: item.originalPrice
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100
        )
      : 0,
    inStock: item.inStock,
  };
};

export const convertToFrontendItem = (item: IBackendCartItem): ICartItem => {
  return {
    slug: item.slug,
    title: item.title,
    price: item.price,
    originalPrice: item.isSale
      ? Math.round(item.price / (1 - item.salePercent / 100))
      : undefined,
    image: item.image,
    quantity: item.quantity,
    inStock: item.inStock,
  };
};

export const calculateCartTotals = (items: ICartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const total = subtotal;

  return { totalItems, subtotal, discount, total };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const isValidCartItem = (item: any): item is ICartItem => {
  return (
    item &&
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    typeof item.inStock === "boolean"
  );
};

export const cleanCartItems = (items: any[]): ICartItem[] => {
  return items.filter(isValidCartItem);
};

export const mergeCartItems = (
  localItems: ICartItem[],
  backendItems: IBackendCartItem[]
): ICartItem[] => {
  const merged = new Map<string, ICartItem>();

  backendItems.forEach((backendItem) => {
    const frontendItem = convertToFrontendItem(backendItem);
    merged.set(frontendItem.slug, frontendItem);
  });

  localItems.forEach((localItem) => {
    const existingItem = merged.get(localItem.slug);
    if (existingItem) {
      merged.set(localItem.slug, {
        ...existingItem,
        quantity: localItem.quantity + existingItem.quantity, // Add quantities together
      });
    } else {
      merged.set(localItem.slug, localItem);
    }
  });

  return Array.from(merged.values());
};
