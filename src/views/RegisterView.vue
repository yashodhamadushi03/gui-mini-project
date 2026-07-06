<template>
  <div>
    <ShopVueNavbar />

    <div class="login-page">
      <div class="left-section">
        <div class="login-box">
          <h1>REGISTER</h1>

          <div class="input-box">
            <i class="fa-regular fa-user"></i>
            <input type="text" placeholder="Username" />
          </div>

          <div class="input-box">
            <i class="fa-solid fa-lock"></i>
            <input type="password" placeholder="Password" />
          </div>

          <div class="btn-wrapper">
            <button>Login Now</button>
          </div>

          <div class="bottom-line"></div>
        </div>
      </div>

      <div class="right-section">
        <div class="circle circle1"></div>
        <div class="circle circle2"></div>
        <div class="circle circle3"></div>

        <div class="image-card">
          <img src="/images/girl.png" alt="girl" class="main-image" />

          <div class="small-circle">
            ⚡
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ShopVueNavbar from "@/components/Navigation.vue";
import "@/assets/css/login.css";
</script>