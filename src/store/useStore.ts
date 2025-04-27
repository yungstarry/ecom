import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User } from '../types';
import { supabase } from '../lib/supabase';

interface Store {
  user: User | null;
  cart: CartItem[];
  guestCart: CartItem[];
  setUser: (user: User | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  mergeGuestCart: () => Promise<void>;
  initializeUserSession: () => Promise<void>;
}

// Initialize Supabase auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    useStore.getState().initializeUserSession();
  }
});

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      guestCart: [],
      
      initializeUserSession: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            try {
              // Fetch user's cart from Supabase
              const { data: userCart, error } = await supabase
                .from('user_cart')
                .select('cart_items')
                .eq('user_id', user.id)
                .single();

              if (error) {
                if (error.code === 'PGRST116') {
                  // No cart exists yet, create one
                  await supabase
                    .from('user_cart')
                    .insert({
                      user_id: user.id,
                      cart_items: [],
                      updated_at: new Date().toISOString()
                    });
                  set({ user, cart: [] });
                } else {
                  console.error('Error fetching user cart:', error);
                  set({ user, cart: [] });
                }
              } else {
                set({ 
                  user,
                  cart: userCart?.cart_items || []
                });
              }
            } catch (error) {
              console.error('Error handling user cart:', error);
              set({ user, cart: [] });
            }
          }
        } catch (error) {
          console.error('Error initializing user session:', error);
        }
      },

      setUser: async (user) => {
        const prevUser = get().user;
        set({ user });

        // If logging in
        if (user && !prevUser) {
          try {
            // Fetch user's cart from Supabase
            const { data: userCart, error } = await supabase
              .from('user_cart')
              .select('cart_items')
              .eq('user_id', user.id)
              .single();

            if (error) {
              if (error.code === 'PGRST116') {
                // No cart exists yet, create one
                await supabase
                  .from('user_cart')
                  .insert({
                    user_id: user.id,
                    cart_items: [],
                    updated_at: new Date().toISOString()
                  });
                set({ cart: [] });
              } else {
                console.error('Error fetching user cart:', error);
                set({ cart: [] });
              }
            } else {
              set({ cart: userCart?.cart_items || [] });
            }
          } catch (error) {
            console.error('Error handling user cart:', error);
            set({ cart: [] });
          }
        } 
        // If logging out
        else if (!user && prevUser) {
          // Clear user cart but keep guest cart
          set({ cart: [] });
        }
      },

      addToCart: async (item) => {
        const state = get();
        const isGuest = !state.user;
        const currentCart = isGuest ? state.guestCart : state.cart;

        // Check for existing item and merge quantities
        const existingItem = currentCart.find((i) => 
          i.id === item.id && 
          i.selectedSize === item.selectedSize && 
          i.selectedColor === item.selectedColor
        );

        const newCart = existingItem
          ? currentCart.map((i) =>
              i.id === item.id &&
              i.selectedSize === item.selectedSize &&
              i.selectedColor === item.selectedColor
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.stock) }
                : i
            )
          : [...currentCart, { ...item, quantity: Math.min(item.quantity, item.stock) }];

        if (isGuest) {
          set({ guestCart: newCart });
        } else {
          set({ cart: newCart });
          try {
            // Sync with Supabase
            const { error } = await supabase
              .from('user_cart')
              .upsert({
                user_id: state.user.id,
                cart_items: newCart,
                updated_at: new Date().toISOString()
              });
            
            if (error) {
              console.error('Error updating cart in database:', error);
            }
          } catch (error) {
            console.error('Error syncing cart with database:', error);
          }
        }
      },

      removeFromCart: async (productId) => {
        const state = get();
        const isGuest = !state.user;
        const currentCart = isGuest ? state.guestCart : state.cart;

        const newCart = currentCart.filter((item) => item.id !== productId);

        if (isGuest) {
          set({ guestCart: newCart });
        } else {
          set({ cart: newCart });
          try {
            // Sync with Supabase
            const { error } = await supabase
              .from('user_cart')
              .upsert({
                user_id: state.user.id,
                cart_items: newCart,
                updated_at: new Date().toISOString()
              });
            
            if (error) {
              console.error('Error updating cart in database:', error);
            }
          } catch (error) {
            console.error('Error syncing cart with database:', error);
          }
        }
      },

      updateCartItemQuantity: async (productId, quantity) => {
        const state = get();
        const isGuest = !state.user;
        const currentCart = isGuest ? state.guestCart : state.cart;

        const newCart = currentCart.map((item) =>
          item.id === productId ? { ...item, quantity: Math.min(quantity, item.stock) } : item
        );

        if (isGuest) {
          set({ guestCart: newCart });
        } else {
          set({ cart: newCart });
          try {
            // Sync with Supabase
            const { error } = await supabase
              .from('user_cart')
              .upsert({
                user_id: state.user.id,
                cart_items: newCart,
                updated_at: new Date().toISOString()
              });
            
            if (error) {
              console.error('Error updating cart in database:', error);
            }
          } catch (error) {
            console.error('Error syncing cart with database:', error);
          }
        }
      },

      clearCart: async () => {
        const state = get();
        const isGuest = !state.user;

        if (isGuest) {
          set({ guestCart: [] });
        } else {
          set({ cart: [] });
          try {
            // Clear cart in Supabase
            const { error } = await supabase
              .from('user_cart')
              .upsert({
                user_id: state.user.id,
                cart_items: [],
                updated_at: new Date().toISOString()
              });
            
            if (error) {
              console.error('Error clearing cart in database:', error);
            }
          } catch (error) {
            console.error('Error syncing cart with database:', error);
          }
        }
      },

      mergeGuestCart: async () => {
        const state = get();
        if (!state.user || state.guestCart.length === 0) return;

        // Merge guest cart with user cart
        const mergedCart = [...state.cart];
        
        // Process each guest item
        state.guestCart.forEach(guestItem => {
          const existingItem = mergedCart.find(item => 
            item.id === guestItem.id && 
            item.selectedSize === guestItem.selectedSize && 
            item.selectedColor === guestItem.selectedColor
          );

          if (existingItem) {
            // Update quantity without exceeding stock
            existingItem.quantity = Math.min(
              existingItem.quantity + guestItem.quantity,
              guestItem.stock
            );
          } else {
            // Add new item
            mergedCart.push({
              ...guestItem,
              quantity: Math.min(guestItem.quantity, guestItem.stock)
            });
          }
        });

        try {
          // Update state and Supabase
          set({ cart: mergedCart, guestCart: [] });
          const { error } = await supabase
            .from('user_cart')
            .upsert({
              user_id: state.user.id,
              cart_items: mergedCart,
              updated_at: new Date().toISOString()
            });
          
          if (error) {
            console.error('Error merging cart in database:', error);
          }
        } catch (error) {
          console.error('Error syncing merged cart with database:', error);
        }
      }
    }),
    {
      name: 'luxe-store',
      partialize: (state) => ({ 
        guestCart: state.guestCart,
        user: state.user 
      }), // Persist guest cart and user in localStorage
    }
  )
);

// Initialize user session on app load
useStore.getState().initializeUserSession();