import { ICartItem } from "@/store/cartSlice";

// Backend cart item interface (matching API)
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

// Convert frontend cart item to backend format
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

// Convert backend cart item to frontend format
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

// Calculate cart totals
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

// Format currency for Vietnam
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Validate cart item
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

// Clean cart items from localStorage
export const cleanCartItems = (items: any[]): ICartItem[] => {
  return items.filter(isValidCartItem);
};

// Merge local cart items with backend cart items
// Priority: local items take precedence for quantity if item exists in both
export const mergeCartItems = (
  localItems: ICartItem[],
  backendItems: IBackendCartItem[]
): ICartItem[] => {
  const merged = new Map<string, ICartItem>();

  // Add backend items first (converted to frontend format)
  backendItems.forEach((backendItem) => {
    const frontendItem = convertToFrontendItem(backendItem);
    merged.set(frontendItem.slug, frontendItem);
  });

  // Add/update with local items (local takes priority for quantity)
  localItems.forEach((localItem) => {
    const existingItem = merged.get(localItem.slug);
    if (existingItem) {
      // Item exists in both - use local quantity but keep backend data for other fields
      merged.set(localItem.slug, {
        ...existingItem,
        quantity: localItem.quantity + existingItem.quantity, // Add quantities together
      });
    } else {
      // Item only exists locally
      merged.set(localItem.slug, localItem);
    }
  });

  return Array.from(merged.values());
};
