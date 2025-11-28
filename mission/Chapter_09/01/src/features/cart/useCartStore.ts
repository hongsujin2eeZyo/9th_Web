import { create } from 'zustand';
import cartItemsData from '../../constants/cartItems';

export interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: cartItemsData,
  amount: cartItemsData.reduce((s, i) => s + i.amount, 0),
  total: cartItemsData.reduce((s, i) => s + parseInt(i.price) * i.amount, 0),

  increase: (id) => {
    const { cartItems } = get();
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, amount: item.amount + 1 } : item
    );
    set({ cartItems: updated });
    get().calculateTotals();
  },

  decrease: (id) => {
    const { cartItems } = get();
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, amount: item.amount - 1 } : item
      )
      .filter((item) => item.amount > 0);

    set({ cartItems: updated });
    get().calculateTotals();
  },

  removeItem: (id) => {
    set({
      cartItems: get().cartItems.filter((item) => item.id !== id),
    });
    get().calculateTotals();
  },

  clearCart: () => {
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    });
  },

  calculateTotals: () => {
    const { cartItems } = get();
    const amount = cartItems.reduce((a, i) => a + i.amount, 0);
    const total = cartItems.reduce(
      (a, i) => a + parseInt(i.price) * i.amount,
      0
    );
    set({ amount, total });
  },
}));
