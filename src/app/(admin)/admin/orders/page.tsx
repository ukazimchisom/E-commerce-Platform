"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import Badge, {
  getOrderStatusVariant,
  getPaymentStatusVariant,
} from "@/components/ui/Badge";
import type { OrderStatus } from "@/types/database";
import { Search } from "lucide-react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { formatNairaFromUsd } from "@/utils/format";

interface AdminOrder {
  id: string;
  status: OrderStatus;
  payment_status: string;
  total_amount: number;
  created_at: string;
  shipping_address: string | null;
  profiles: { full_name: string | null; email: string } | null;
  order_items: { id: string }[];
}

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { rate } = useExchangeRate();

  const fetchOrders = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id, status, payment_status, total_amount,
          created_at, shipping_address,
          profiles(full_name, email),
          order_items(id)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data ?? []) as AdminOrder[]);
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success(`Order status updated to "${newStatus}".`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      !search ||
      truncateId(order.id).includes(search.toUpperCase()) ||
      (order.profiles?.email ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order.profiles?.full_name ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Order Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search by ID, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-48 px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders table */}
      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-800 text-sm">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Date",
                    "Update Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-300/50 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-gray-800 text-xs whitespace-nowrap">
                      #{truncateId(order.id)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-black text-xs font-medium">
                        {order.profiles?.full_name ?? "Guest"}
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        {order.profiles?.email ?? "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs text-center">
                      {order.order_items?.length ?? 0}
                    </td>
                    <td className="px-5 py-4 text-gray-300 font-medium text-xs whitespace-nowrap">
                      {formatNairaFromUsd(order.total_amount, rate)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        label={order.payment_status}
                        variant={getPaymentStatusVariant(order.payment_status)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        label={order.status}
                        variant={getOrderStatusVariant(order.status)}
                      />
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
