import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Product } from './CartContext';
import { supabase } from '@/integrations/supabase/client';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        offer: p.offer || undefined,
        category: p.category,
        aisle: p.aisle,
        stock: p.stock,
        expiryDate: p.expiry_date,
        image: p.image,
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { error } = await supabase.from('products').insert({
        name: product.name,
        brand: product.brand,
        price: product.price,
        original_price: product.originalPrice || null,
        offer: product.offer || null,
        category: product.category,
        aisle: product.aisle,
        stock: product.stock,
        expiry_date: product.expiryDate,
        image: product.image,
      });

      if (error) throw error;

      // Refresh products from database
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const dbUpdates: Record<string, unknown> = {};
      
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
      if (updates.offer !== undefined) dbUpdates.offer = updates.offer || null;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.aisle !== undefined) dbUpdates.aisle = updates.aisle;
      if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
      if (updates.expiryDate !== undefined) dbUpdates.expiry_date = updates.expiryDate;
      if (updates.image !== undefined) dbUpdates.image = updates.image;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // Refresh products from database
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh products from database
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      isLoading, 
      addProduct, 
      updateProduct, 
      deleteProduct,
      refreshProducts: fetchProducts 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
