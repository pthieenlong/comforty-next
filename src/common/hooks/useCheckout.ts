"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/common/hooks/useCart";
import { orderService, CreateOrderRequest } from "@/services/orderService";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  postalCode: string;
  notes: string;
}

interface PaymentInfo {
  method: "cod" | "card" | "bank";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface CheckoutValidation {
  isValid: boolean;
  errors: string[];
}

export const useCheckout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearAllItems } = useCart();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: user?.username ? `${user.username}@example.com` : "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    postalCode: "",
    notes: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "cod",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Calculate totals
  const shipping = subtotal > 1000000 ? 0 : 50000;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Validation functions
  const validateShipping = useCallback((): CheckoutValidation => {
    const errors: string[] = [];

    if (!shippingInfo.firstName.trim()) errors.push("First name is required");
    if (!shippingInfo.lastName.trim()) errors.push("Last name is required");
    if (!shippingInfo.email.trim()) errors.push("Email is required");
    if (!shippingInfo.phone.trim()) errors.push("Phone is required");
    if (!shippingInfo.address.trim()) errors.push("Address is required");
    if (!shippingInfo.city.trim()) errors.push("City is required");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingInfo.email && !emailRegex.test(shippingInfo.email)) {
      errors.push("Please enter a valid email address");
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (shippingInfo.phone && !phoneRegex.test(shippingInfo.phone)) {
      errors.push("Please enter a valid phone number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [shippingInfo]);

  const validatePayment = useCallback((): CheckoutValidation => {
    const errors: string[] = [];

    if (paymentInfo.method === "card") {
      if (!paymentInfo.cardNumber.trim())
        errors.push("Card number is required");
      if (!paymentInfo.expiryDate.trim())
        errors.push("Expiry date is required");
      if (!paymentInfo.cvv.trim()) errors.push("CVV is required");
      if (!paymentInfo.cardName.trim())
        errors.push("Cardholder name is required");

      // Card number validation
      if (
        paymentInfo.cardNumber &&
        paymentInfo.cardNumber.replace(/\s/g, "").length < 13
      ) {
        errors.push("Please enter a valid card number");
      }

      // CVV validation
      if (paymentInfo.cvv && paymentInfo.cvv.length < 3) {
        errors.push("Please enter a valid CVV");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [paymentInfo]);

  const validateTerms = useCallback((): CheckoutValidation => {
    const errors: string[] = [];

    if (!agreeToTerms) {
      errors.push("You must agree to the terms and conditions");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [agreeToTerms]);

  // Combined validation
  const validateStep = useCallback(
    (step: number): CheckoutValidation => {
      switch (step) {
        case 1:
          return validateShipping();
        case 2:
          return validatePayment();
        case 3:
          return validateTerms();
        default:
          return { isValid: false, errors: ["Invalid step"] };
      }
    },
    [validateShipping, validatePayment, validateTerms]
  );

  // Submit order
  const submitOrder = useCallback(async (): Promise<{
    success: boolean;
    orderId?: string;
    error?: string;
  }> => {
    if (!user?.UID) {
      return { success: false, error: "User not authenticated" };
    }

    const validation = validateStep(3);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return { success: false, error: validation.errors.join(", ") };
    }

    setProcessing(true);
    setErrors([]);

    try {
      const orderData: CreateOrderRequest = {
        items: items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping: shippingInfo,
        payment: {
          method: paymentInfo.method,
          ...(paymentInfo.method === "card" && {
            cardNumber: paymentInfo.cardNumber,
            expiryDate: paymentInfo.expiryDate,
            cvv: paymentInfo.cvv,
            cardName: paymentInfo.cardName,
          }),
        },
        totals: {
          subtotal,
          shipping,
          tax,
          total,
        },
        userId: user.UID,
      };

      const response = await orderService.createOrder(orderData);

      if (response.success && response.data) {
        clearAllItems();
        return { success: true, orderId: response.data.orderId };
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors([errorMessage]);
      return { success: false, error: errorMessage };
    } finally {
      setProcessing(false);
    }
  }, [
    user?.UID,
    validateStep,
    items,
    shippingInfo,
    paymentInfo,
    subtotal,
    shipping,
    tax,
    total,
    clearAllItems,
  ]);

  // Update shipping info
  const updateShippingInfo = useCallback(
    (field: keyof ShippingInfo, value: string) => {
      setShippingInfo((prev) => ({ ...prev, [field]: value }));
      // Clear related errors when user starts typing
      setErrors((prev) =>
        prev.filter(
          (error) => !error.toLowerCase().includes(field.toLowerCase())
        )
      );
    },
    []
  );

  // Update payment info
  const updatePaymentInfo = useCallback(
    (field: keyof PaymentInfo, value: string) => {
      setPaymentInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    // State
    shippingInfo,
    paymentInfo,
    agreeToTerms,
    processing,
    errors,

    // Calculated values
    shipping,
    tax,
    total,

    // Actions
    updateShippingInfo,
    updatePaymentInfo,
    setAgreeToTerms,
    setErrors,
    validateStep,
    submitOrder,

    // Validation helpers
    validateShipping,
    validatePayment,
    validateTerms,
  };
};
