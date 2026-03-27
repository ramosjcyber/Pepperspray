import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Star,
  Heart,
  BookOpen,
  Menu,
  X,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CashAppPayButton from "@/components/CashAppPayButton";

const books = [
  {
    id: 1,
    title: "Midnight Vows",
    author: "A. Sinclair",
    price: 18.99,
    rating: 4.9,
    description:
      "A dangerously addictive romance with obsession, secrets, and high-stakes tension.",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    tag: "Bestseller",
  },
  {
    id: 2,
    title: "The Quiet Library",
    author: "M. Harper",
    price: 16.99,
    rating: 4.7,
    description:
      "A haunting mystery hidden between dusty shelves and unfinished stories.",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    tag: "New",
  },
  {
    id: 3,
    title: "Empire of Ink",
    author: "J. Moreau",
    price: 21.5,
    rating: 4.8,
    description:
      "Magic, rebellion, and forbidden alliances in a world written by power.",
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    tag: "Trending",
  },
  {
    id: 4,
    title: "Coffee Shop Chapters",
    author: "L. Bennett",
    price: 14.99,
    rating: 4.6,
    description:
      "A warm, cozy story about second chances and unexpected love.",
    cover:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    tag: "Staff Pick",
  },
  {
    id: 5,
    title: "Paper Crown",
    author: "R. Vale",
    price: 19.99,
    rating: 4.8,
    description:
      "A gripping cat-and-mouse thriller full of ambition, betrayal, and revenge.",
    cover:
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=900&q=80",
    tag: "Popular",
  },
  {
    id: 6,
    title: "Letters After Rain",
    author: "C. Monroe",
    price: 15.99,
    rating: 4.5,
    description: "Tender, emotional, and impossible to put down.",
    cover:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
    tag: "Featured",
  },
];

function BookCard({ book, onAddToCart }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm transition-all hover:shadow-xl">
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
          <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
          <Badge className="absolute left-3 top-3 rounded-full bg-black text-white">
            {book.tag}
          </Badge>
          <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <CardContent className="space-y-3 p-5">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Premium Edition
            </p>
            <h3 className="leading-tight text-xl font-semibold text-zinc-900">
              {book.title}
            </h3>
            <p className="text-sm text-zinc-600">by {book.author}</p>
          </div>

          <p className="text-sm leading-6 text-zinc-600">{book.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-zinc-700">{book.rating}</span>
            </div>
            <div className="text-lg font-bold text-zinc-900">
              ${book.price.toFixed(2)}
            </div>
          </div>

          <Button
            onClick={() => onAddToCart(book)}
            className="w-full rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function BookSellingWebsite() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      [book.title, book.author, book.description]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query]);

  const addToCart = (book) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === book.id);
      if (found) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...book, qty: 1 }];
    });

    setPaymentSuccess("");
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutOpen(true);
    setPaymentSuccess("");
  };

  const handleCashAppPaid = (paymentData) => {
    console.log("Payment success:", paymentData);
    setPaymentSuccess("Payment successful. Your order is confirmed.");
    setCheckoutOpen(false);
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[#f7f5f1]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Velvet Shelf</h1>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Premium Bookstore
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium text-zinc-700 hover:text-black">
              Home
            </a>
            <a href="#shop" className="text-sm font-medium text-zinc-700 hover:text-black">
              Shop
            </a>
            <a
              href="#featured"
              className="text-sm font-medium text-zinc-700 hover:text-black"
            >
              Featured
            </a>
            <a href="#about" className="text-sm font-medium text-zinc-700 hover:text-black">
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden rounded-2xl md:inline-flex">
              Sign In
            </Button>

            <Button
              onClick={() => setCartOpen(true)}
              className="relative rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-zinc-900">
                  {cartCount}
                </span>
              )}
            </Button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-2xl border border-zinc-200 bg-white p-2 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-zinc-200 bg-white md:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
                <a href="#home" className="text-sm font-medium text-zinc-700">
                  Home
                </a>
                <a href="#shop" className="text-sm font-medium text-zinc-700">
                  Shop
                </a>
                <a href="#featured" className="text-sm font-medium text-zinc-700">
                  Featured
                </a>
                <a href="#about" className="text-sm font-medium text-zinc-700">
                  About
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section
          id="home"
          className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24"
        >
          <div className="space-y-8">
            <Badge className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-zinc-700 shadow-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Collector-worthy books with a premium checkout
            </Badge>

            <div className="space-y-4">
              <h2 className="max-w-xl text-5xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
                Your premium storefront for selling books.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-zinc-600">
                Clean, elevated, product-first, and built to let customers buy your
                books with a modern checkout flow.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="rounded-2xl bg-zinc-900 px-6 py-6 text-white hover:bg-zinc-800">
                Shop Now
              </Button>
              <Button variant="outline" className="rounded-2xl bg-white px-6 py-6">
                Browse Collection
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <Truck className="mb-3 h-5 w-5" />
                <p className="font-semibold">Fast Shipping</p>
                <p className="text-sm text-zinc-600">Quick dispatch for eager readers.</p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <ShieldCheck className="mb-3 h-5 w-5" />
                <p className="font-semibold">Secure Checkout</p>
                <p className="text-sm text-zinc-600">Cash App Pay integration ready.</p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <Star className="mb-3 h-5 w-5" />
                <p className="font-semibold">Premium Experience</p>
                <p className="text-sm text-zinc-600">Built for a luxury bookstore feel.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-rose-200/40 blur-3xl" />
            <div className="absolute -right-8 bottom-6 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"
                alt="Stack of books"
                className="h-[520px] w-full rounded-[1.5rem] object-cover"
              />
            </motion.div>
          </div>
        </section>

        <section id="shop" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Shop
              </p>
              <h3 className="text-3xl font-bold tracking-tight">Your books</h3>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title or author"
                  className="w-full rounded-2xl border-zinc-200 bg-white pl-10 sm:w-80"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={addToCart} />
            ))}
          </div>
        </section>

        <section id="featured" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] bg-zinc-900 p-8 text-white sm:p-10">
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-400">
                Featured Collection
              </p>
              <h3 className="max-w-md text-4xl font-bold tracking-tight">
                Premium books, clean storefront, real checkout.
              </h3>
              <p className="mt-4 max-w-xl leading-8 text-zinc-300">
                Use this section for your limited drops, signed copies, featured book
                bundles, or your bestselling titles.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="rounded-full bg-white/10 px-4 py-2 text-white">
                  Signed Copies
                </Badge>
                <Badge className="rounded-full bg-white/10 px-4 py-2 text-white">
                  Collector Bundles
                </Badge>
                <Badge className="rounded-full bg-white/10 px-4 py-2 text-white">
                  Limited Drops
                </Badge>
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
                Newsletter
              </p>
              <h4 className="text-3xl font-bold tracking-tight">
                Get first access to new arrivals.
              </h4>
              <p className="mt-3 leading-7 text-zinc-600">
                Collect emails for launch drops, reading lists, special releases, and
                restocks.
              </p>
              <div className="mt-6 space-y-3">
                <Input
                  placeholder="Enter your email"
                  className="rounded-2xl border-zinc-200 bg-zinc-50"
                />
                <Button className="w-full rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800">
                  Join the List
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="rounded-[2rem] border-zinc-200 bg-white shadow-sm lg:col-span-2">
              <CardContent className="p-8 sm:p-10">
                <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
                  About the store
                </p>
                <h3 className="text-3xl font-bold tracking-tight">
                  Built for readers who want more than a boring storefront.
                </h3>
                <p className="mt-4 leading-8 text-zinc-600">
                  This version is focused on selling books with a high-end feel and a
                  real checkout flow, starting with Cash App Pay.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-zinc-200 bg-white shadow-sm">
              <CardContent className="p-8">
                <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Ready to launch
                </p>
                <ul className="space-y-3 text-sm text-zinc-700">
                  <li>• Product cards and search</li>
                  <li>• Cart UI and totals</li>
                  <li>• Checkout selector</li>
                  <li>• Cash App Pay button</li>
                  <li>• Mobile-friendly layout</li>
                  <li>• Easy to add Amazon Pay later</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Velvet Shelf. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-black">
              Privacy
            </a>
            <a href="#" className="hover:text-black">
              Terms
            </a>
            <a href="#" className="hover:text-black">
              Contact
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />

            <motion.aside
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
                <div>
                  <h4 className="text-xl font-bold">Your Cart</h4>
                  <p className="text-sm text-zinc-500">{cartCount} item(s)</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full border border-zinc-200 p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                {paymentSuccess && (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    {paymentSuccess}
                  </div>
                )}

                {cart.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-zinc-200 p-8 text-center text-zinc-500">
                    Your cart is empty.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-3xl border border-zinc-200 p-4">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="h-24 w-20 rounded-2xl object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="leading-tight font-semibold">{item.title}</h5>
                        <p className="mt-1 text-sm text-zinc-500">{item.author}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="h-8 w-8 rounded-full border border-zinc-200"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="h-8 w-8 rounded-full border border-zinc-200"
                            >
                              +
                            </button>
                          </div>
                          <div className="font-bold">
                            ${(item.price * item.qty).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4 border-t border-zinc-200 px-6 py-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <Button
                  onClick={openCheckout}
                  className="w-full rounded-2xl bg-zinc-900 py-6 text-white hover:bg-zinc-800"
                >
                  Proceed to Checkout
                </Button>

                {checkoutOpen && cart.length > 0 && (
                  <div className="space-y-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        Choose payment method
                      </p>
                      <h5 className="mt-1 text-lg font-bold text-zinc-900">
                        Fast, premium checkout
                      </h5>
                      <p className="mt-1 text-sm text-zinc-600">
                        Use Cash App Pay for your order.
                      </p>
                    </div>

                    <CashAppPayButton
                      total={cartTotal}
                      cart={cart}
                      onPaid={handleCashAppPaid}
                    />

                    <Button
                      variant="outline"
                      className="w-full rounded-2xl bg-white py-6"
                      onClick={() => alert("Amazon Pay comes next.")}
                    >
                      Amazon Pay Coming Next
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setCartOpen(false)}
                  className="w-full rounded-2xl bg-white"
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
