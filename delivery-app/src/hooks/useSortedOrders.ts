import { useState, useMemo } from "react";
import { OrderWithQuote } from "../types";

export const SORT_TABS = [
  // { id: 'closest', label: 'Más cercanos', sortby: 'distance' },
  { id: "highest", label: "Mayor pago", sortby: "amount" },
  { id: "heavy", label: "Cargas pesadas", sortby: "weight" },
  { id: "light", label: "Cargas livianas", sortby: "light" },
];

export function useSortedOrders<T extends OrderWithQuote>(initialOrders: T[]) {
  const [activeTab, setActiveTab] = useState("default");

  const orderdOrders = useMemo(() => {
    const currentTab = SORT_TABS.find((tab) => tab.id === activeTab);
    const sortBy = currentTab ? currentTab.sortby : "createdAt";

    const sorted = [...initialOrders];

    return sorted.sort((a, b) => {
      switch (sortBy) {
        case "weight":
          return b.totalWeight - a.totalWeight; // Cargas pesadas primero
        case "amount":
          return (b.quote?.amount || 0) - (a.quote?.amount || 0); // Mayor pago primero
        case "light":
          return a.totalWeight - b.totalWeight; // Cargas livianas primero
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ); // Más recientes primero
      }
    });
  }, [initialOrders, activeTab]);

  return {
    orderdOrders,
    activeTab,
    setActiveTab,
    tabs: SORT_TABS,
  };
}
