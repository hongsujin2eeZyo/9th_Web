import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';

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
}

const initialState: CartState = {
  cartItems: cartItems as CartItem[],
  amount: 0,
  total: 0,
};

// 초기 렌더링 시 amount와 total 계산
const calculateInitialTotals = (items: CartItem[]): { amount: number; total: number } => {
  const amount = items.reduce((sum, item) => sum + item.amount, 0);
  const total = items.reduce((sum, item) => sum + parseInt(item.price) * item.amount, 0);
  return { amount, total };
};

const initialTotals = calculateInitialTotals(cartItems);
initialState.amount = initialTotals.amount;
initialState.total = initialTotals.total;

// 합계 계산 헬퍼 함수
const calculateTotalsHelper = (state: CartState) => {
  state.amount = state.cartItems.reduce((sum, item) => sum + item.amount, 0);
  state.total = state.cartItems.reduce((sum, item) => sum + parseInt(item.price) * item.amount, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
      calculateTotalsHelper(state);
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount -= 1;
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        }
      }
      calculateTotalsHelper(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      calculateTotalsHelper(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      calculateTotalsHelper(state);
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;

