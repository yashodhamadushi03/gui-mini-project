<template>
  <div>
    <ShopVueNavbar />

    <section class="hero">
      <div class="category-bar">
        <button
            class="category-btn"
            :class="{ active: selectedCategory === '' }"
            @click="selectCategory('')"
        >
          All
        </button>
        <button
            v-for="cat in categories"
            :key="cat.slug"
            class="category-btn"
            :class="{ active: selectedCategory === cat.slug }"
            @click="selectCategory(cat.slug)"
        >
          {{ cat.name }}
        </button>
      </div>

      <h1 class="hero-heading">All Products</h1>
    </section>

    <section class="product-section">
      <div v-if="loading && products.length === 0" class="loading-text">Loading products...</div>
      <div v-else-if="error" class="error-text">{{ error }}</div>
      <div v-else-if="products.length === 0" class="empty-text">No products found.</div>

      <template v-else>
        <div class="product-grid">
          <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @view-details="goToDetails"
          />
        </div>

        <div class="load-more-wrap" v-if="hasMore">
          <button class="load-more-btn" @click="loadMore" :disabled="loading">
            {{ loading ? "Loading..." : "Load more" }}
          </button>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import { useRouter } from "vue-router";
import ShopVueNavbar from "@/components/Navigation.vue";
import ProductCard from "@/components/ProductCard.vue";
import type { Product, Category } from "@/types/Product";

const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();

const PAGE_SIZE = 12;

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const selectedCategory = ref<string>("");
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const skip = ref<number>(0);
const total = ref<number>(0);

const hasMore = computed(() => products.value.length < total.value);

const fetchCategories = async (): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/products/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data: Category[] = await res.json();
    categories.value = data;
  } catch (err) {
    console.error(err);
  }
};

const fetchProducts = async (reset = false): Promise<void> => {
  loading.value = true;
  error.value = null;
  try {
    const currentSkip = reset ? 0 : skip.value;
    const endpoint = selectedCategory.value
        ? `${API_URL}/products/category/${selectedCategory.value}?limit=${PAGE_SIZE}&skip=${currentSkip}`
        : `${API_URL}/products?limit=${PAGE_SIZE}&skip=${currentSkip}`;

    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data: { products: Product[]; total: number } = await res.json();

    products.value = reset ? data.products : [...products.value, ...data.products];
    total.value = data.total;
    skip.value = currentSkip + PAGE_SIZE;
  } catch (err) {
    error.value = "Could not load products. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const selectCategory = (slug: string): void => {
  selectedCategory.value = slug;
  skip.value = 0;
  fetchProducts(true);
};

const loadMore = (): void => {
  fetchProducts(false);
};

const goToDetails = (id: number): void => {
  router.push(`/product/${id}`);
};

onMounted(() => {
  fetchCategories();
  fetchProducts(true);
});
</script>

<style scoped src="@/assets/css/product.css"></style>