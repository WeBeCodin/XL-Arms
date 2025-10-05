import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RSRProduct } from '@/lib/types/rsr';

export interface CartItem {
  product: RSRProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: RSRProduct, quantity?: number) => void;
  removeItem: (stockNumber: string) => void;
  updateQuantity: (stockNumber: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItem: (stockNumber: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.rsrStockNumber === product.rsrStockNumber
          );
          
          if (existingItem) {
            // Update quantity if item exists
            return {
              items: state.items.map((item) =>
                item.product.rsrStockNumber === product.rsrStockNumber
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            // Add new item
            return {
              items: [...state.items, { product, quantity }],
            };
          }
        });
      },
      
      removeItem: (stockNumber) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.rsrStockNumber !== stockNumber
          ),
        }));
      },
      
      updateQuantity: (stockNumber, quantity) => {
        if (quantity <= 0) {
          get().removeItem(stockNumber);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.rsrStockNumber === stockNumber
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getItem: (stockNumber) => {
        return get().items.find(
          (item) => item.product.rsrStockNumber === stockNumber
        );
      },
    }),
    {
      name: 'xl-arms-cart', // localStorage key
    }
  )
);
