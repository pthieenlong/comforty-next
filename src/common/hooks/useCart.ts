import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  updateItemStock,
  loadCart,
  selectCart,
  selectCartItems,
  selectCartItemsCount,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  selectIsItemInCart,
  selectCartItemBySlug,
  ICartItem,
} from "@/store/cartSlice";

// Custom hook for cart management
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const items = useAppSelector(selectCartItems);
  const itemsCount = useAppSelector(selectCartItemsCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = useAppSelector(selectCartTotal);
  const discount = useAppSelector(selectCartDiscount);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch(loadCart(parsedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, [dispatch]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Action creators
  const addItem = useCallback(
    (item: Omit<ICartItem, "quantity">) => {
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (slug: string) => {
      dispatch(removeFromCart(slug));
    },
    [dispatch]
  );

  const updateItemQuantity = useCallback(
    (slug: string, quantity: number) => {
      dispatch(updateQuantity({ slug, quantity }));
    },
    [dispatch]
  );

  const increaseItemQuantity = useCallback(
    (slug: string) => {
      dispatch(increaseQuantity(slug));
    },
    [dispatch]
  );

  const decreaseItemQuantity = useCallback(
    (slug: string) => {
      dispatch(decreaseQuantity(slug));
    },
    [dispatch]
  );

  const clearAllItems = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const updateStock = useCallback(
    (slug: string, inStock: boolean) => {
      dispatch(updateItemStock({ slug, inStock }));
    },
    [dispatch]
  );

  // Helper functions
  const isItemInCart = useCallback(
    (slug: string) => {
      return items.some((item: ICartItem) => item.slug === slug);
    },
    [items]
  );

  const getItemBySlug = useCallback(
    (slug: string) => {
      return items.find((item: ICartItem) => item.slug === slug);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (slug: string) => {
      const item = getItemBySlug(slug);
      return item ? item.quantity : 0;
    },
    [getItemBySlug]
  );

  // Format currency helper
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }, []);

  return {
    // State
    cart,
    items,
    itemsCount,
    subtotal,
    total,
    discount,
    isEmpty: items.length === 0,

    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearAllItems,
    updateStock,

    // Helpers
    isItemInCart,
    getItemBySlug,
    getItemQuantity,
    formatCurrency,
  };
};

// Hook for specific item
export const useCartItem = (slug: string) => {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector(selectIsItemInCart(slug));
  const item = useAppSelector(selectCartItemBySlug(slug));

  const addToCartHandler = useCallback(
    (itemData: Omit<ICartItem, "quantity">) => {
      dispatch(addToCart(itemData));
    },
    [dispatch]
  );

  const removeFromCartHandler = useCallback(() => {
    dispatch(removeFromCart(slug));
  }, [dispatch, slug]);

  const increaseQuantityHandler = useCallback(() => {
    dispatch(increaseQuantity(slug));
  }, [dispatch, slug]);

  const decreaseQuantityHandler = useCallback(() => {
    dispatch(decreaseQuantity(slug));
  }, [dispatch, slug]);

  const updateQuantityHandler = useCallback(
    (quantity: number) => {
      dispatch(updateQuantity({ slug, quantity }));
    },
    [dispatch, slug]
  );

  return {
    isInCart,
    item,
    quantity: item?.quantity || 0,
    addToCart: addToCartHandler,
    removeFromCart: removeFromCartHandler,
    increaseQuantity: increaseQuantityHandler,
    decreaseQuantity: decreaseQuantityHandler,
    updateQuantity: updateQuantityHandler,
  };
};
