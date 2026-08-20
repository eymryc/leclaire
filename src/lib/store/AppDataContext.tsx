"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/cart/CartContext";

export type Order = {
  id: string;
  createdAt: string;
  total: number;
  items: CartItem[];
  status: "en_preparation" | "expediee" | "livree";
  email: string;
};

export type Appointment = {
  id: string;
  storeId: string;
  storeName: string;
  date: string;
  time: string;
  service: string;
  name: string;
  email: string;
};

type WishlistValue = {
  ids: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

type OrdersValue = {
  orders: Order[];
  appointments: Appointment[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  addAppointment: (apt: Omit<Appointment, "id">) => Appointment;
};

const WishlistContext = createContext<WishlistValue | null>(null);
const OrdersContext = createContext<OrdersValue | null>(null);

const WISH_KEY = "lumina-wish-v1";
const ORDERS_KEY = "lumina-orders-v1";
const APT_KEY = "lumina-apt-v1";

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const w = localStorage.getItem(WISH_KEY);
      const o = localStorage.getItem(ORDERS_KEY);
      const a = localStorage.getItem(APT_KEY);
      if (w) setIds(JSON.parse(w) as string[]);
      if (o) setOrders(JSON.parse(o) as Order[]);
      if (a) setAppointments(JSON.parse(a) as Appointment[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISH_KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(APT_KEY, JSON.stringify(appointments));
  }, [appointments, hydrated]);

  const toggle = useCallback((slug: string) => {
    setIds((prev) =>
      prev.includes(slug) ? prev.filter((id) => id !== slug) : [...prev, slug]
    );
  }, []);

  const has = useCallback((slug: string) => ids.includes(slug), [ids]);

  const addOrder = useCallback(
    (order: Omit<Order, "id" | "createdAt" | "status">) => {
      const created: Order = {
        ...order,
        id: `LO-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: "en_preparation",
      };
      setOrders((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const addAppointment = useCallback((apt: Omit<Appointment, "id">) => {
    const created: Appointment = {
      ...apt,
      id: `RDV-${Date.now().toString(36).toUpperCase()}`,
    };
    setAppointments((prev) => [created, ...prev]);
    return created;
  }, []);

  const wishValue = useMemo(
    () => ({ ids, toggle, has }),
    [ids, toggle, has]
  );
  const ordersValue = useMemo(
    () => ({ orders, appointments, addOrder, addAppointment }),
    [orders, appointments, addOrder, addAppointment]
  );

  return (
    <WishlistContext.Provider value={wishValue}>
      <OrdersContext.Provider value={ordersValue}>
        {children}
      </OrdersContext.Provider>
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist within AppDataProvider");
  return ctx;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders within AppDataProvider");
  return ctx;
}
