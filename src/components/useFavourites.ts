import { ref } from "vue";

const STORAGE_KEY = "shopvue-favourites";

function load(): number[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

const favourites = ref<number[]>(load());

function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites.value));
}

export function useFavourites() {
    const isFavourite = (id: number): boolean => favourites.value.includes(id);

    const toggleFavourite = (id: number): void => {
        const idx = favourites.value.indexOf(id);
        if (idx === -1) {
            favourites.value.push(id);
        } else {
            favourites.value.splice(idx, 1);
        }
        persist();
    };

    return { favourites, isFavourite, toggleFavourite };
}