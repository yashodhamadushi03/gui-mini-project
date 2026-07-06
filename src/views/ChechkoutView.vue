<template>
  <div>
    <ShopVueNavbar />

    <div class="checkout-page">
      <div class="cart-section">
        <div class="cart-box">
          <router-link to="/" class="back-link">
            <i class="fa-solid fa-chevron-left"></i> Shopping Continue
          </router-link>
          <div class="divider"></div>

          <div class="cart-header">
            <h2>Shopping cart</h2>
            <p>You have {{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }} in your cart</p>
          </div>

          <div v-if="cart.length === 0" class="empty-cart-text">
            Your cart is empty. <router-link to="/">Continue shopping</router-link>.
          </div>

          <div v-else class="cart-items">
            <div
                class="cart-item"
                v-for="(item, index) in cart"
                :key="`${item.id}-${item.size}-${item.color}`"
            >
              <div class="item-img-wrap">
                <img :src="item.thumbnail" :alt="item.title" />
              </div>

              <div class="item-info">
                <span class="item-name">{{ item.title }}</span>
                <span class="item-meta" v-if="item.size || item.color">
                  <template v-if="item.color">Color: {{ item.color }}</template>
                  <template v-if="item.size"> &nbsp;|&nbsp; Size: {{ item.size }}</template>
                </span>
              </div>

              <div class="item-qty">
                <button class="qty-btn" @click="decrementQty(index)">−</button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button class="qty-btn" @click="incrementQty(index)">+</button>
              </div>

              <span class="item-price">Rs {{ (item.price * item.quantity).toLocaleString() }}</span>

              <button class="delete-btn" @click="removeFromCart(index)">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="payment-section">
        <div class="payment-card">
          <h2 class="card-title">Card Details</h2>

          <div class="field-group">
            <label>Card type</label>
            <div class="card-types">
              <button
                  class="card-type-btn"
                  :class="{ active: selectedCard === 'mastercard' }"
                  @click="selectedCard = 'mastercard'"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1920px-Mastercard-logo.svg.png?_=20210817144358" alt="Mastercard" />
              </button>
              <button
                  class="card-type-btn"
                  :class="{ active: selectedCard === 'visa' }"
                  @click="selectedCard = 'visa'"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/500px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png" alt="Visa" />
              </button>
              <button
                  class="card-type-btn"
                  :class="{ active: selectedCard === 'rupay' }"
                  @click="selectedCard = 'rupay'"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/250px-PayPal.svg.png?_=20241230110020" alt="RuPay" />
              </button>
              <button class="see-all-btn">See all</button>
            </div>
          </div>

          <div class="field-group">
            <label>Name on card</label>
            <input
                v-model="cardName"
                type="text"
                placeholder="Name"
                class="card-input"
            />
          </div>

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

          <button class="checkout-btn" @click="handleCheckout" :disabled="cart.length === 0">
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
import { useCart } from "@/components/useCart";
import "@/assets/css/checkout.css";

const { cart, removeFromCart } = useCart();

const incrementQty = (index) => {
  cart.value[index].quantity += 1;
};

const decrementQty = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity -= 1;
  } else {
    removeFromCart(index);
  }
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
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const shipping = computed(() => 0);
const total = computed(() => subtotal.value + shipping.value);

const handleCheckout = () => {
  alert("Order placed! Total: Rs " + total.value.toLocaleString());
  cart.value.splice(0, cart.value.length);
};
</script>

<style scoped src="@/assets/css/checkout.css"></style>