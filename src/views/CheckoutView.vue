<template>
  <div>
    <!-- Navigation -->
    <ShopVueNavbar />

    <div class="checkout-page">
      <!-- LEFT SIDE: Cart -->
      <div class="cart-section">
        <div class="cart-box">
          <a href="#" class="back-link">
            <i class="fa-solid fa-chevron-left"></i> Shopping Continue
          </a>
          <div class="divider"></div>

          <div class="cart-header">
            <h2>Shopping cart</h2>
            <p>You have {{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }} in your cart</p>
          </div>

          <div class="cart-items">
            <div
              class="cart-item"
              v-for="(item, index) in cartItems"
              :key="index"
            >
              <div class="item-img-wrap">
                <img :src="item.image" :alt="item.name" />
              </div>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">Rs {{ item.price.toLocaleString() }}</span>
              <button class="delete-btn" @click="removeItem(index)">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE: Card Details -->
      <div class="payment-section">
        <div class="payment-card">
          <h2 class="card-title">Card Details</h2>

          <!-- Card Type -->
          <div class="field-group">
            <label>Card type</label>
            <div class="card-types">
              <button
                class="card-type-btn"
                :class="{ active: selectedCard === 'mastercard' }"
                @click="selectedCard = 'mastercard'"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png" alt="Mastercard" />
              </button>
              <button
                class="card-type-btn"
                :class="{ active: selectedCard === 'visa' }"
                @click="selectedCard = 'visa'"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png" alt="Visa" />
              </button>
              <button
                class="card-type-btn"
                :class="{ active: selectedCard === 'rupay' }"
                @click="selectedCard = 'rupay'"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/800px-RuPay.svg.png" alt="RuPay" />
              </button>
              <button class="see-all-btn">See all</button>
            </div>
          </div>

          <!-- Name on Card -->
          <div class="field-group">
            <label>Name on card</label>
            <input
              v-model="cardName"
              type="text"
              placeholder="Name"
              class="card-input"
            />
          </div>

          <!-- Card Number -->
          <div class="field-group">
            <label>Card Number</label>
            <input
              v-model="cardNumber"
              type="text"
              placeholder="1111 2222 3333 4444"
              maxlength="19"
              @input="formatCardNumber"
              class="card-input"
            />
          </div>

          <!-- Expiry + CVV -->
          <div class="field-row">
            <div class="field-group half">
              <label>Expiration date</label>
              <input
                v-model="expiryDate"
                type="text"
                placeholder="mm/yy"
                maxlength="5"
                @input="formatExpiry"
                class="card-input"
              />
            </div>
            <div class="field-group half">
              <label>CVV</label>
              <input
                v-model="cvv"
                type="password"
                placeholder="123"
                maxlength="3"
                class="card-input"
              />
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>Rs {{ subtotal.toLocaleString() }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>{{ shipping === 0 ? 'RS0' : 'Rs ' + shipping.toLocaleString() }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total (Tax incl.)</span>
              <span>Rs {{ total.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Checkout Button -->
          <button class="checkout-btn" @click="handleCheckout">
            <span class="btn-amount">Rs {{ total.toLocaleString() }}</span>
            <span class="btn-label">
              Checkout <i class="fa-solid fa-arrow-right"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ShopVueNavbar from "@/components/Navigation.vue";
import "@/assets/css/checkout.css";

const cartItems = ref([
  {
    name: "iPhone 15 128GB Blue",
    price: 250000,
    image: "/images/iphone15.png",
  },
  {
    name: "Power Bank",
    price: 8000,
    image: "/images/powerbank.png",
  },
]);

const removeItem = (index) => {
  cartItems.value.splice(index, 1);
};

const selectedCard = ref("mastercard");
const cardName = ref("");
const cardNumber = ref("");
const expiryDate = ref("");
const cvv = ref("");

const formatCardNumber = () => {
  let val = cardNumber.value.replace(/\D/g, "").substring(0, 16);
  cardNumber.value = val.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = () => {
  let val = expiryDate.value.replace(/\D/g, "").substring(0, 4);
  if (val.length >= 3) {
    expiryDate.value = val.substring(0, 2) + "/" + val.substring(2);
  } else {
    expiryDate.value = val;
  }
};

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price, 0)
);
const shipping = computed(() => 0);
const total = computed(() => subtotal.value + shipping.value);

const handleCheckout = () => {
  alert("Order placed! Total: Rs " + total.value.toLocaleString());
};
</script>