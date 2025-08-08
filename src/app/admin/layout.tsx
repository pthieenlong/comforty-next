import type { Metadata } from "next";
import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export const metadata: Metadata = {
  title: "Comforty Admin",
  description: "Comforty admin panel",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-neutral-200 bg-white">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Accent top bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
