import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Cart item interface
export interface ICartItem {
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
}

// Cart state interface
export interface ICart {
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}

// Initial state
const initialState: ICart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
};

// Helper function to calculate cart totals
const calculateCartTotals = (items: ICartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate discount based on original prices
  const discount = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const total = subtotal;

  return { totalItems, subtotal, discount, total };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<Omit<ICartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) => item.slug === action.payload.slug
      );

      if (existingItem) {
        // If item already exists, increase quantity
        existingItem.quantity += 1;
      } else {
        // Add new item with quantity 1
        state.items.push({ ...action.payload, quantity: 1 });
      }

      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.total = totals.total;
    },

    // Remove item from cart completely
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.slug !== action.payload);

      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.total = totals.total;
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{ slug: string; quantity: number }>
    ) => {
      const { slug, quantity } = action.payload;
      const item = state.items.find((item) => item.slug === slug);

      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter((item) => item.slug !== slug);
        } else {
          item.quantity = quantity;
        }

        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        state.discount = totals.discount;
        state.total = totals.total;
      }
    },

    // Increase item quantity by 1
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.slug === action.payload);

      if (item) {
        item.quantity += 1;

        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        state.discount = totals.discount;
        state.total = totals.total;
      }
    },

    // Decrease item quantity by 1
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.slug === action.payload);

      if (item) {
        if (item.quantity <= 1) {
          // Remove item if quantity becomes 0
          state.items = state.items.filter(
            (item) => item.slug !== action.payload
          );
        } else {
          item.quantity -= 1;
        }

        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        state.discount = totals.discount;
        state.total = totals.total;
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
    },

    // Update item stock status
    updateItemStock: (
      state,
      action: PayloadAction<{ slug: string; inStock: boolean }>
    ) => {
      const { slug, inStock } = action.payload;
      const item = state.items.find((item) => item.slug === slug);

      if (item) {
        item.inStock = inStock;
      }
    },

    // Load cart from localStorage (for persistence)
    loadCart: (state, action: PayloadAction<ICartItem[]>) => {
      state.items = action.payload;

      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.total = totals.total;
    },
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  updateItemStock,
  loadCart,
} = cartSlice.actions;

// Selectors
export const selectCart = (state: { cart: ICart }) => state.cart;
export const selectCartItems = (state: { cart: ICart }) => state.cart.items;
export const selectCartItemsCount = (state: { cart: ICart }) =>
  state.cart.totalItems;
export const selectCartSubtotal = (state: { cart: ICart }) =>
  state.cart.subtotal;
export const selectCartTotal = (state: { cart: ICart }) => state.cart.total;
export const selectCartDiscount = (state: { cart: ICart }) =>
  state.cart.discount;
export const selectIsItemInCart = (slug: string) => (state: { cart: ICart }) =>
  state.cart.items.some((item) => item.slug === slug);
export const selectCartItemBySlug =
  (slug: string) => (state: { cart: ICart }) =>
    state.cart.items.find((item) => item.slug === slug);

export default cartSlice.reducer;
