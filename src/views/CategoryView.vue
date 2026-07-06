<template>
  <div>
    <ShopVueNavbar />

    <section class="category-hero">
      <router-link to="/" class="back-link">
        <i class="fa-solid fa-chevron-left"></i> Back to Home
      </router-link>
      <h1 class="category-heading">{{ formattedCategoryName }}</h1>
      <p class="category-count" v-if="!loading && !error">
        {{ products.length }} product{{ products.length !== 1 ? 's' : '' }} found
      </p>
    </section>

    <section class="product-section">
      <div v-if="loading" class="loading-text">Loading products...</div>
      <div v-else-if="error" class="error-text">{{ error }}</div>
      <div v-else-if="products.length === 0" class="empty-text">
        No products found in this category.
      </div>

      <div v-else class="product-grid">
        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @view-details="goToDetails"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ShopVueNavbar from "@/components/Navigation.vue";
import ProductCard from "@/components/ProductCard.vue";
import type { Product } from "@/types/Product";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const router = useRouter();

const products = ref<Product[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const categorySlug = computed(() => route.params.slug as string);

const formattedCategoryName = computed(() =>
    categorySlug.value
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") ?? ""
);

const fetchProducts = async (slug: string): Promise<void> => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(`${API_URL}/products/category/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data: { products: Product[] } = await res.json();
    products.value = data.products;
  } catch (err) {
    error.value = "Could not load products. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goToDetails = (id: number): void => {
  router.push(`/product/${id}`);
};

onMounted(() => {
  fetchProducts(categorySlug.value);
});

watch(categorySlug, (newSlug) => {
  fetchProducts(newSlug);
});
</script>

<style scoped src="@/assets/css/category.css"></style>