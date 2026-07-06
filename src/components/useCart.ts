import { ref, computed } from "vue";

export interface CartItem {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
    size?: string;
    color?: string;
}

const STORAGE_KEY = "shopvue-cart";

function loadCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

const cart = ref<CartItem[]>(loadCart());

function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.value));
}

export function useCart() {
    const cartCount = computed(() =>
        cart.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const addToCart = (
        item: Omit<CartItem, "quantity">,
        quantity: number
    ): void => {
        const existing = cart.value.find(
            (c) => c.id === item.id && c.size === item.size && c.color === item.color
        );
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.value.push({ ...item, quantity });
        }
        persist();
    };

    const removeFromCart = (index: number): void => {
        cart.value.splice(index, 1);
        persist();
    };

    return { cart, cartCount, addToCart, removeFromCart };
}