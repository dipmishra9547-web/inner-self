import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background/90">
      <Header />
      <main className="flex-1 flex flex-col pt-24">{children}</main>
      <Footer />
    </div>
  );
}
