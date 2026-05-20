import {useState, useMemo} from 'react';
import { Order } from '../types';


export const SORT_TABS = [
    // { id: 'closest', label: 'Más cercanos', sortby: 'distance' },
    // { id: 'highest', label: 'Mayor pago', sortby: 'amount' },
    { id: 'heavy', label: 'Cargas pesadas', sortby: 'weight' },
  ];

export function useSortedOrders(initialOrders: Order[]) {
    const [activeTab, setActiveTab] = useState('recent');

    const orderdOrders = useMemo(() => {
        const currentTab = SORT_TABS.find(tab => tab.id === activeTab);
        const sortBy = currentTab ? currentTab.sortby : 'createdAt';

        const sorted = [...initialOrders];

        return sorted.sort((a, b) => {
            switch (sortBy) {
                case 'weight':
                    return b.totalWeight - a.totalWeight; // Cargas pesadas primero
                case 'createdAt':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Más recientes primero
            }
        });
    }, [initialOrders, activeTab]);

    return {
        orderdOrders,
        activeTab,
        setActiveTab,
        tabs: SORT_TABS
    };
}