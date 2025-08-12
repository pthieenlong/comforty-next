import { useCallback, useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
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
import { cartService } from "@/services/cartService";
import {
  convertToBackendItem,
  convertToFrontendItem,
  cleanCartItems,
  mergeCartItems,
} from "@/utils/cartUtils";

// Custom hook for cart management
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const items = useAppSelector(selectCartItems);
  const itemsCount = useAppSelector(selectCartItemsCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = useAppSelector(selectCartTotal);
  const discount = useAppSelector(selectCartDiscount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSyncedRef = useRef(false);
  const lastUserRef = useRef<string | null>(null);

  // Get user info from auth context
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, load from localStorage
        let currentItems: ICartItem[] = [];
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          const cleanedCart = cleanCartItems(parsedCart);
          currentItems = cleanedCart;
          dispatch(loadCart(cleanedCart));
        }
        // Sync with backend if user is authenticated
        if (isAuthenticated && user && user.username) {
          await syncWithBackend(currentItems);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setError("Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [dispatch, isAuthenticated, user]);

  // Separate sync function for regular operations (no dependency on items)
  const syncWithBackend = useCallback(
    async (localItems: ICartItem[]) => {
      if (!isAuthenticated || !user || !user.username) return;

      try {
        // First get existing backend cart
        const existingCart = await cartService.getCart(user.username);

        if (existingCart.success && existingCart.data) {
          // Merge local items with backend items
          const backendItems = existingCart.data.items;
          const mergedItems = mergeCartItems(localItems, backendItems);

          // Send merged items back to backend
          const backendFormatItems = mergedItems.map((item) =>
            convertToBackendItem(item)
          );
          const result = await cartService.syncCart(
            user.username,
            backendFormatItems
          );

          if (result.success && result.data) {
            // Update local state with synced data
            const frontendItems = result.data.items.map((item) =>
              convertToFrontendItem(item)
            );
            dispatch(loadCart(frontendItems));
          }
        } else {
          // No existing backend cart, sync local items
          const backendItems = localItems.map((item) =>
            convertToBackendItem(item)
          );
          const result = await cartService.syncCart(
            user.username,
            backendItems
          );

          if (result.success && result.data) {
            const frontendItems = result.data.items.map((item) =>
              convertToFrontendItem(item)
            );
            dispatch(loadCart(frontendItems));
          }
        }
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
        // Don't clear local cart on sync error - keep working offline
      }
    },
    [isAuthenticated, user, dispatch]
  );

  // Handle authentication state changes - sync once per login
  useEffect(() => {
    const currentUsername = user?.username || null;

    if (isAuthenticated && user && user.username) {
      // Only sync if user changed and haven't synced yet
      if (lastUserRef.current !== currentUsername && !hasSyncedRef.current) {
        lastUserRef.current = currentUsername;

        // Perform sync once with current items
        const performInitialSync = async () => {
          setLoading(true);
          try {
            // Get current items snapshot
            const currentItems = JSON.parse(
              localStorage.getItem("cart") || "[]"
            );
            await syncWithBackend(currentItems);
            hasSyncedRef.current = true;
          } catch (error) {
            console.error("Initial sync failed:", error);
          } finally {
            setLoading(false);
          }
        };

        // Small delay to ensure auth state is stable
        const timer = setTimeout(performInitialSync, 300);
        return () => clearTimeout(timer);
      }
    } else if (!isAuthenticated && !user) {
      // User logged out - reset sync state
      lastUserRef.current = null;
      hasSyncedRef.current = false;
    }
  }, [isAuthenticated, user?.username]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Action creators with backend sync
  const addItem = useCallback(
    async (item: Omit<ICartItem, "quantity">) => {
      dispatch(addToCart(item));

      // Sync with backend if authenticated
      if (isAuthenticated && user && user.username) {
        try {
          await cartService.addProduct(user.username, item.slug);
        } catch (error) {
          console.error("Failed to add item to backend cart:", error);
          setError("Không thể thêm sản phẩm vào giỏ hàng");
        }
      }
    },
    [dispatch, isAuthenticated, user]
  );

  const removeItem = useCallback(
    async (slug: string) => {
      dispatch(removeFromCart(slug));

      // Sync with backend if authenticated
      if (isAuthenticated && user && user.username) {
        try {
          await cartService.removeProduct(user.username, slug);
        } catch (error) {
          console.error("Failed to remove item from backend cart:", error);
          setError("Không thể xóa sản phẩm khỏi giỏ hàng");
        }
      }
    },
    [dispatch, isAuthenticated, user]
  );

  const updateItemQuantity = useCallback(
    async (slug: string, quantity: number) => {
      dispatch(updateQuantity({ slug, quantity }));

      // Sync with backend if authenticated
      if (isAuthenticated && user && user.username) {
        try {
          await cartService.updateQuantity(user.username, slug, quantity);
        } catch (error) {
          console.error("Failed to update quantity in backend cart:", error);
          setError("Không thể cập nhật số lượng sản phẩm");
        }
      }
    },
    [dispatch, isAuthenticated, user]
  );

  const increaseItemQuantity = useCallback(
    async (slug: string) => {
      dispatch(increaseQuantity(slug));

      // Sync with backend if authenticated
      if (isAuthenticated && user && user.username) {
        try {
          await cartService.addProduct(user.username, slug);
        } catch (error) {
          console.error(
            "Failed to increase item quantity in backend cart:",
            error
          );
          setError("Không thể tăng số lượng sản phẩm");
        }
      }
    },
    [dispatch, isAuthenticated, user]
  );

  const decreaseItemQuantity = useCallback(
    async (slug: string) => {
      dispatch(decreaseQuantity(slug));

      // Sync with backend if authenticated
      if (isAuthenticated && user && user.username) {
        try {
          await cartService.decreaseProduct(user.username, slug);
        } catch (error) {
          console.error(
            "Failed to decrease item quantity in backend cart:",
            error
          );
          setError("Không thể giảm số lượng sản phẩm");
        }
      }
    },
    [dispatch, isAuthenticated, user]
  );

  const clearAllItems = useCallback(async () => {
    dispatch(clearCart());

    // Sync with backend if authenticated
    if (isAuthenticated && user && user.username) {
      try {
        await cartService.clearCart(user.username);
      } catch (error) {
        console.error("Failed to clear backend cart:", error);
        setError("Không thể xóa giỏ hàng");
      }
    }
  }, [dispatch, isAuthenticated, user]);

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
    loading,
    error,

    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearAllItems,
    updateStock,
    syncWithBackend,

    // Helpers
    isItemInCart,
    getItemBySlug,
    getItemQuantity,
    formatCurrency,

    // Error handling
    clearError: () => setError(null),
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
