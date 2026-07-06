<template>
  <div>
    <ShopVueNavbar />

    <div v-if="loading" class="loading-text">Loading product...</div>
    <div v-else-if="error" class="error-text">{{ error }}</div>

    <div v-else-if="product" class="product-page">
      <h1 class="product-page-title">{{ product.title }}</h1>

      <!-- Tabs -->
      <div class="tabs">
        <button
            class="tab-btn"
            :class="{ active: activeTab === 'general' }"
            @click="activeTab = 'general'"
        >
          General info
        </button>
        <button
            class="tab-btn"
            :class="{ active: activeTab === 'details' }"
            @click="activeTab = 'details'"
        >
          Product details
        </button>
        <button
            class="tab-btn"
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
        >
          Reviews <sup>{{ product.reviews?.length ?? 0 }}</sup>
        </button>
      </div>
      <div class="tabs-divider"></div>

      <div v-if="activeTab === 'general'" class="product-main">
        <!-- LEFT: Image Gallery -->
        <div class="gallery">
          <button class="gallery-arrow left" @click="prevImage" aria-label="Previous image">
            ←
          </button>
          <img :src="currentImage" :alt="product.title" class="gallery-img" />
          <button class="gallery-arrow right" @click="nextImage" aria-label="Next image">
            →
          </button>
        </div>

        <!-- RIGHT: Purchase Panel -->
        <div class="purchase-panel">
          <div class="price-row">
            <span class="price-current">RS {{ discountedPrice.toLocaleString() }}</span>
            <span class="price-original">RS {{ originalPrice.toLocaleString() }}</span>
            <span class="discount-badge">-{{ Math.round(product.discountPercentage) }}%</span>

            <div class="rating-block">
              <span class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(product.rating) }">★</span>
              </span>
              <span class="review-count">{{ product.reviews?.length ?? 0 }} reviews</span>
            </div>
          </div>

          <!-- Color -->
          <div class="field-group">
            <label class="field-label">Color</label>
            <div class="color-swatches">
              <button
                  v-for="color in colorOptions"
                  :key="color.name"
                  class="swatch"
                  :class="{ active: selectedColor === color.name }"
                  :style="{ '--swatch-color': color.hex }"
                  @click="selectedColor = color.name"
                  :aria-label="color.name"
              ></button>
              <span class="color-label">{{ selectedColor }}</span>
            </div>
          </div>

          <!-- Size -->
          <div class="field-group">
            <div class="size-row">
              <label class="field-label">Size</label>
              <a href="#" class="size-chart-link">📏 Size chart</a>
            </div>
            <select v-model="selectedSize" class="size-select">
              <option value="" disabled>Please select</option>
              <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>

          <!-- Quantity + Actions -->
          <div class="action-row">
            <input
                type="number"
                class="qty-input"
                v-model.number="quantity"
                min="1"
                @change="quantity < 1 && (quantity = 1)"
            />

            <button class="add-to-cart-btn" @click="handleAddToCart">
              🛒 Add to cart
            </button>

            <button
                class="favourite-btn"
                @click="handleToggleFavourite"
                :class="{ active: isCurrentFavourite }"
            >
              {{ isCurrentFavourite ? '♥' : '♡' }} Favourite
            </button>
          </div>
        </div>
      </div>

      <!-- Product Details Tab -->
      <div v-else-if="activeTab === 'details'" class="details-panel">
        <p>{{ product.description }}</p>
        <ul class="details-list">
          <li><strong>Brand:</strong> {{ product.brand || "N/A" }}</li>
          <li><strong>Category:</strong> {{ product.category }}</li>
          <li><strong>Stock:</strong> {{ product.stock }} units</li>
        </ul>
      </div>

      <!-- Reviews Tab -->
      <div v-else-if="activeTab === 'reviews'" class="reviews-panel">
        <div v-if="!product.reviews?.length">No reviews yet.</div>
        <div v-for="(review, i) in product.reviews" :key="i" class="review-item">
          <div class="review-header">
            <span class="review-name">{{ review.reviewerName }}</span>
            <span class="review-stars">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
            </span>
          </div>
          <p class="review-comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>

    <!-- Toast / message box (replaces alert()) -->
    <Transition name="toast-fade">
      <div v-if="toast.visible" class="toast" :class="toast.type">
        <span class="toast-icon">
          {{ toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✅' : 'ℹ️' }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="hideToast" aria-label="Close">✕</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import ShopVueNavbar from "@/components/Navigation.vue";
import { useCart } from "@/components/useCart";
import { useFavourites } from "@/components/useFavourites";

interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
}

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  images: string[];
  thumbnail: string;
  reviews?: Review[];
}

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const { addToCart } = useCart();
const { isFavourite, toggleFavourite } = useFavourites();

const product = ref<ProductDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const activeTab = ref<"general" | "details" | "reviews">("general");
const currentImageIndex = ref(0);
const selectedColor = ref("Pink");
const selectedSize = ref("");
const quantity = ref(1);

const colorOptions = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#93c5fd" },
  { name: "Pink", hex: "#ec4899" },
];

const sizeOptions = ["XS", "S", "M", "L", "XL"];

type ToastType = "success" | "error" | "info";

const toast = ref<{ visible: boolean; message: string; type: ToastType }>({
  visible: false,
  message: "",
  type: "info",
});

let toastTimer: ReturnType<typeof setTimeout> | null = null;

const showToast = (message: string, type: ToastType = "info", duration = 3000): void => {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { visible: true, message, type };
  toastTimer = setTimeout(() => {
    toast.value.visible = false;
  }, duration);
};

const hideToast = (): void => {
  toast.value.visible = false;
  if (toastTimer) clearTimeout(toastTimer);
};

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer);
});

const fetchProduct = async (): Promise<void> => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(`${API_URL}/products/${route.params.id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    product.value = await res.json();
  } catch (err) {
    error.value = "Could not load product. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProduct);

const currentImage = computed(() =>
    product.value?.images?.[currentImageIndex.value] || product.value?.thumbnail || ""
);

const prevImage = (): void => {
  if (!product.value) return;
  const len = product.value.images.length;
  currentImageIndex.value = (currentImageIndex.value - 1 + len) % len;
};

const nextImage = (): void => {
  if (!product.value) return;
  const len = product.value.images.length;
  currentImageIndex.value = (currentImageIndex.value + 1) % len;
};

const originalPrice = computed(() =>
    product.value ? Math.round(product.value.price * 300) : 0
);

const discountedPrice = computed(() => {
  if (!product.value) return 0;
  const discounted =
      product.value.price * (1 - product.value.discountPercentage / 100);
  return Math.round(discounted * 300);
});

const isCurrentFavourite = computed(() =>
    product.value ? isFavourite(product.value.id) : false
);

const handleAddToCart = (): void => {
  if (!selectedSize.value) {
    showToast("Please select a size first.", "error");
    return;
  }
  if (!product.value) return;

  addToCart(
      {
        id: product.value.id,
        title: product.value.title,
        price: discountedPrice.value,
        thumbnail: product.value.thumbnail,
        size: selectedSize.value,
        color: selectedColor.value,
      },
      quantity.value
  );

  showToast(`Added ${quantity.value} × ${product.value.title} to cart.`, "success");
};

const handleToggleFavourite = (): void => {
  if (!product.value) return;
  toggleFavourite(product.value.id);
};
</script>

<style scoped src="@/assets/css/product_details_view.css"></style>