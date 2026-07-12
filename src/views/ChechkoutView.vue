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

      <div class="payment-section" v-if="cart.length > 0">
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/250px-PayPal.svg.png?_=20241230110020" alt="PayPal" />
              </button>
              <button class="see-all-btn">See all</button>
            </div>
          </div>

          <!-- Card fields (hidden for PayPal) -->
          <template v-if="!isPaypalSelected">
            <div class="field-group">
              <label>Name on card</label>
              <input
                  v-model="cardName"
                  type="text"
                  placeholder="Name"
                  class="card-input"
                  :class="{ 'input-error': fieldErrors.cardName }"
              />
              <span v-if="fieldErrors.cardName" class="field-error">{{ fieldErrors.cardName }}</span>
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
                  :class="{ 'input-error': fieldErrors.cardNumber }"
              />
              <span v-if="fieldErrors.cardNumber" class="field-error">{{ fieldErrors.cardNumber }}</span>
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
                    :class="{ 'input-error': fieldErrors.expiryDate }"
                />
                <span v-if="fieldErrors.expiryDate" class="field-error">{{ fieldErrors.expiryDate }}</span>
              </div>
              <div class="field-group half">
                <label>CVV</label>
                <input
                    v-model="cvv"
                    type="password"
                    placeholder="123"
                    maxlength="3"
                    class="card-input"
                    :class="{ 'input-error': fieldErrors.cvv }"
                />
                <span v-if="fieldErrors.cvv" class="field-error">{{ fieldErrors.cvv }}</span>
              </div>
            </div>
          </template>

          <!-- PayPal notice -->
          <div v-else class="paypal-notice">
            You'll be redirected to PayPal to complete your payment securely.
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

    <!-- Message box (replaces alert) -->
    <Transition name="msgbox-fade">
      <div v-if="msgBox.visible" class="msgbox-overlay" @click.self="closeMsgBox">
        <div class="msgbox" :class="msgBox.type">
          <div class="msgbox-header">
            <span class="msgbox-title">{{ msgBox.title }}</span>
            <button class="msgbox-close" @click="closeMsgBox" aria-label="Close">✕</button>
          </div>
          <p class="msgbox-body">{{ msgBox.message }}</p>
          <button class="msgbox-ok" @click="closeMsgBox">OK</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import ShopVueNavbar from "@/components/Navigation.vue";
import { useCart } from "@/components/useCart";
import "@/assets/css/checkout.css";

const router = useRouter();
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

// The third "card type" button uses the PayPal logo (variable name kept as
// "rupay" from before — consider renaming to "paypal" for clarity)
const isPaypalSelected = computed(() => selectedCard.value === "rupay");

const fieldErrors = reactive({
  cardName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
});

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

/* ---------------- Message box (replaces alert) ---------------- */
const msgBox = ref({
  visible: false,
  title: "",
  message: "",
  type: "success", // "success" | "error" | "info"
  redirectOnClose: false,
});

const showMsgBox = (title, message, type = "success", redirectOnClose = false) => {
  msgBox.value = { visible: true, title, message, type, redirectOnClose };
};

const closeMsgBox = () => {
  const shouldRedirect = msgBox.value.redirectOnClose;
  msgBox.value.visible = false;
  if (shouldRedirect) {
    router.push("/");
  }
};
/* ---------------------------------------------------------------- */

/* ---------------- Card details validation ---------------- */
const validateCardDetails = () => {
  // No card fields to validate when paying via PayPal
  if (isPaypalSelected.value) return true;

  fieldErrors.cardName = "";
  fieldErrors.cardNumber = "";
  fieldErrors.expiryDate = "";
  fieldErrors.cvv = "";

  let isValid = true;

  if (!cardName.value.trim()) {
    fieldErrors.cardName = "Name on card is required.";
    isValid = false;
  }

  const digitsOnly = cardNumber.value.replace(/\s/g, "");
  if (!digitsOnly) {
    fieldErrors.cardNumber = "Card number is required.";
    isValid = false;
  } else if (digitsOnly.length !== 16) {
    fieldErrors.cardNumber = "Card number must be 16 digits.";
    isValid = false;
  }

  if (!expiryDate.value) {
    fieldErrors.expiryDate = "Expiration date is required.";
    isValid = false;
  } else if (!/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
    fieldErrors.expiryDate = "Use mm/yy format.";
    isValid = false;
  } else {
    const [mm, yy] = expiryDate.value.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (mm < 1 || mm > 12) {
      fieldErrors.expiryDate = "Invalid month.";
      isValid = false;
    } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      fieldErrors.expiryDate = "Card has expired.";
      isValid = false;
    }
  }

  if (!cvv.value) {
    fieldErrors.cvv = "CVV is required.";
    isValid = false;
  } else if (!/^\d{3}$/.test(cvv.value)) {
    fieldErrors.cvv = "CVV must be 3 digits.";
    isValid = false;
  }

  return isValid;
};
/* ------------------------------------------------------------ */

const handleCheckout = () => {
  if (!validateCardDetails()) {
    showMsgBox("Missing details", "Please fill in all card details correctly before checking out.", "error");
    return;
  }

  const orderTotal = total.value.toLocaleString();
  cart.value.splice(0, cart.value.length);
  cardName.value = "";
  cardNumber.value = "";
  expiryDate.value = "";
  cvv.value = "";
  showMsgBox("Order placed", "Your total was Rs " + orderTotal + ".", "success", true);
};
</script>

<style scoped src="@/assets/css/checkout.css"></style>