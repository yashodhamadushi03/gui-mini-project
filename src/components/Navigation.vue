<template>
  <nav class="sv-nav">
    <div class="sv-nav__inner">

      <!-- Brand Logo -->
      <a class="sv-brand" @click="active = 'Home'">
        <img :src="logo" alt="ShopVue" class="sv-brand__logo" />
      </a>

      <!-- Desktop Nav Links -->
      <ul class="sv-links">
        <li v-for="link in navLinks" :key="link">
          <button class="sv-links__btn" @click="active = link">
            {{ link }}
          </button>
        </li>
      </ul>

      <!-- Mobile Hamburger -->
      <button class="sv-hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span v-if="menuOpen">✕</span>
        <span v-else>☰</span>
      </button>
    </div>

    <!-- Mobile Dropdown -->
    <div v-if="menuOpen" class="sv-mobile-menu">
      <button
        v-for="link in navLinks"
        :key="link"
        class="sv-mobile-menu__btn"
        @click="active = link; menuOpen = false"
      >
        {{ link }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import logo from "@/assets/images/shopvue-logo.png";

const navLinks = ["Home", "Categories", "Register", "Login"];
const active = ref("Home");
const menuOpen = ref(false);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

.sv-nav {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  font-family: 'DM Sans', sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
}

.sv-nav__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 28px;
  height: 64px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
}

.sv-brand {
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
}

.sv-brand__logo {
  height: 44px;
  width: auto;
  object-fit: contain;
  display: block;
}

.sv-links {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.sv-links__btn {
  background: none;
  border: none;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  padding: 8px 20px;
  transition: color 0.2s;
}

.sv-links__btn:hover {
  color: #111;
}

.sv-hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px 8px;
  color: #333;
}

.sv-mobile-menu {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-top: 1px solid #e5e5e5;
  padding: 12px 20px 20px;
  gap: 4px;
}

.sv-mobile-menu__btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  padding: 11px 14px;
  text-align: left;
}

.sv-mobile-menu__btn:hover {
  color: #111;
}

@media (max-width: 680px) {
  .sv-links      { display: none; }
  .sv-hamburger  { display: flex; }
  .sv-nav__inner { height: 56px; }
}
</style>