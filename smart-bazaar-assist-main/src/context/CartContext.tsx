import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWeightInfo, calculateWeightPrice } from '@/lib/productUtils';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  offer?: string;
  category: string;
  aisle: string;
  stock: number;
  expiryDate: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  weightInGrams?: number; // For weight-based products
  calculatedPrice?: number; // Price based on weight
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weightInGrams?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateWeight: (productId: string, weightInGrams: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  cartBounce: boolean;
  persistCartForAuth: () => void;
  restoreCartFromAuth: () => boolean;
}

const CART_STORAGE_KEY = 'smart_bazaar_cart';
const CART_AUTH_STORAGE_KEY = 'smart_bazaar_cart_auth_pending';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Restore cart from localStorage on initial load
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (e) {
      console.error('Failed to restore cart:', e);
    }
    return [];
  });
  const [cartBounce, setCartBounce] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [items]);

  // Persist cart specifically for auth flow (before magic link redirect)
  const persistCartForAuth = () => {
    try {
      localStorage.setItem(CART_AUTH_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart for auth:', e);
    }
  };

  // Restore cart after auth success - returns true if cart was restored
  const restoreCartFromAuth = (): boolean => {
    try {
      const savedCart = localStorage.getItem(CART_AUTH_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.length > 0) {
          setItems(parsedCart);
          localStorage.removeItem(CART_AUTH_STORAGE_KEY);
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to restore cart from auth:', e);
    }
    return false;
  };

  const addToCart = (product: Product, weightInGrams?: number) => {
    const weightInfo = getWeightInfo(product.name, product.price);
    
    setItems(prev => {
      // For weight-based products, we check by ID + weight to allow multiple entries
      const existing = prev.find(item => 
        item.id === product.id && 
        (!weightInGrams || item.weightInGrams === weightInGrams)
      );
      
      if (existing && !weightInGrams) {
        // Non-weight product: just increment quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Calculate price for weight-based products
      let calculatedPrice = product.price;
      if (weightInfo && weightInGrams) {
        calculatedPrice = calculateWeightPrice(weightInfo.pricePerGram, weightInGrams);
      }
      
      return [...prev, { 
        ...product, 
        quantity: 1,
        weightInGrams: weightInGrams,
        calculatedPrice: weightInGrams ? calculatedPrice : undefined,
      }];
    });
    
    // Trigger bounce animation
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 300);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateWeight = (productId: string, weightInGrams: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const weightInfo = getWeightInfo(item.name, item.price);
          if (weightInfo) {
            const calculatedPrice = calculateWeightPrice(weightInfo.pricePerGram, weightInGrams);
            return { ...item, weightInGrams, calculatedPrice };
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total price considering weight-based items
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = item.calculatedPrice ?? item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateWeight,
        clearCart,
        totalItems,
        totalPrice,
        cartBounce,
        persistCartForAuth,
        restoreCartFromAuth,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
