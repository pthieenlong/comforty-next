"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { AuthProvider } from "@/contexts/AuthContext";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
