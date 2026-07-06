<template>
  <nav class="sv-nav">
    <div class="sv-nav__inner">

      <!-- Brand Logo -->
      <router-link to="/" class="sv-brand">
        <img :src="logo" alt="ShopVue" class="sv-brand__logo" />
      </router-link>

      <!-- Desktop Nav Links -->
      <ul class="sv-links">
        <li v-for="link in navLinks" :key="link.name">
          <router-link
              :to="link.path"
              class="sv-links__btn"
              active-class="sv-links__btn--active"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>

      <!-- Cart Icon -->
      <router-link to="/checkout" class="sv-cart" aria-label="Cart">
        <font-awesome-icon icon="cart-shopping" />
        <span v-if="cartCount > 0" class="sv-cart__badge">{{ cartCount }}</span>
      </router-link>

      <!-- Mobile Hamburger -->
      <button class="sv-hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span v-if="menuOpen">✕</span>
        <span v-else>☰</span>
      </button>
    </div>

    <!-- Mobile Dropdown -->
    <div v-if="menuOpen" class="sv-mobile-menu">
      <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          class="sv-mobile-menu__btn"
          active-class="sv-mobile-menu__btn--active"
          @click="menuOpen = false"
      >
        {{ link.name }}
      </router-link>

      <!-- Cart in mobile menu -->
      <router-link
          to="/checkout"
          class="sv-mobile-menu__btn"
          active-class="sv-mobile-menu__btn--active"
          @click="menuOpen = false"
      >
        <font-awesome-icon icon="cart-shopping" /> Cart
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import logo from "@/assets/images/shopvue-logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Register", path: "/register" },
  { name: "Login", path: "/login" },
];

const menuOpen = ref(false);

// Placeholder — wire this up to your actual cart state/store
const cartCount = ref(0);
</script>

<style scoped src="@/assets/css/navbar.css"></style>