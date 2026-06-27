'use client';

import * as React from "react";
import { Navbar } from "../components/navigation/navbar";
import { NavLink } from "../components/navigation/nav-link";
import { Logo } from "../components/navigation/logo";
import { Badge } from "../components/ui/badge";
import { Container } from "../components/layout/container";

interface MainLayoutProps {
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function MainLayout({ children, rightSlot }: MainLayoutProps) {
  const navLinks = [
    { href: "/", label: "Home", isActive: true },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        brandName="MFC"
        links={navLinks}
        rightSlot={rightSlot}
      />
      {children}
      <footer className="border-t border-gray-200 bg-white">
        <Container size="lg" className="py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} MFC Platform. All rights reserved.</p>
            <nav className="flex items-center gap-6" aria-label="Footer">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Support</a>
            </nav>
          </div>
        </Container>
      </footer>
    </div>
  );
}
