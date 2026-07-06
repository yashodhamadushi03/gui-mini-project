<template>
  <div class="product-card">
    <div class="product-img-wrap">
      <img :src="product.thumbnail" :alt="product.title" />
    </div>
    <h3 class="product-title">{{ product.title }}</h3>
    <p class="product-price">RS {{ displayPrice.toLocaleString() }}</p>
    <button class="view-details-btn" @click="$emit('view-details', product.id)">
      View Details
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/types/Product";

const props = defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: "view-details", id: number): void;
}>();

// rough USD -> Rs conversion for demo purposes
const displayPrice = computed(() => Math.round(props.product.price * 300));
</script>

<style scoped src="@/assets/css/product_card.css"></style>