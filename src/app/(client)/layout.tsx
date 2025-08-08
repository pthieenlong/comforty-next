import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/client/Header";
import Footer from "@/components/client/Footer";

export const metadata: Metadata = {
  title: "Comforty - Cửa hàng nội thất hiện đại",
  description:
    "Khám phá nội thất cao cấp cho ngôi nhà của bạn. Mua sắm ghế, bàn, sofa và nhiều hơn nữa tại Comforty.",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
