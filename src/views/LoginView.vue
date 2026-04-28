<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      
      <!-- Title -->
      <h2 class="text-3xl font-semibold text-center text-gray-800 mb-2">
        Welcome Back
      </h2>

      <p class="text-center text-gray-500 mb-6 text-sm">
        Sign in to continue
      </p>

      <form @submit.prevent="handleLogin" class="space-y-5">

    
        <div>
          <label class="block text-sm text-gray-600 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </div>

      
        <div>
          <label class="block text-sm text-gray-600 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </div>


        <button
          type="submit"
          class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-300 shadow-sm hover:shadow-md"
        >
          Login
        </button>

      </form>

 

    </div>
  </div>
</template>