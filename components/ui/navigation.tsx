"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { Menu, X, LogIn } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/providers", label: "Providers" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            Sideline
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative py-2 ${
                  isActive(link.href)
                    ? "text-primary font-semibold bg-primary/5 px-3 rounded-md before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary"
                    : "text-gray-600 hover:text-gray-900 px-3"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="ml-4">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-md text-base font-medium transition-all ${
                  isActive(link.href)
                    ? "text-primary font-semibold bg-primary/10 border-l-4 border-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              {isSignedIn ? (
                <div className="px-3">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
