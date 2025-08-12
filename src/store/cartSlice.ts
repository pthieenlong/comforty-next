import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ICartItem {
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
}


export interface ICart {
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}


const initialState: ICart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
};

const calculateCartTotals = (items: ICartItem[]) => {
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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<ICartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) => item.slug === action.payload.slug
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.total = totals.total;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.slug !== action.payload);

      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.total = totals.total;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ slug: string; quantity: number }>
    ) => {
      const { slug, quantity } = action.payload;
      const item = state.items.find((item) => item.slug === slug);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.slug !== slug);
        } else {
          item.quantity = quantity;
        }

        const totals = calculateCartTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        state.discount = totals.discount;
        state.total = totals.total;
      }
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.slug === action.payload);

      if (item) {
        item.quantity += 1;

        const totals = calculateCartTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        state.discount = totals.discount;
        state.total = totals.total;
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.slug === action.payload);

      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(
            (item) => item.slug !== action.payload
          );
        } else {
          item.quantity -= 1;
        }

        const totals = calculateCartTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        state.discount = totals.discount;
        state.total = totals.total;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
    },

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

    loadCart: (state, action: PayloadAction<ICartItem[]>) => {
      state.items = action.payload;

      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.total = totals.total;
    },
  },
});


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
