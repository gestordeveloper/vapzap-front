<script setup>
</script>

<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 items-center">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer">
          <img src="/logo.svg" alt="VapZap Logo" class="h-10 w-auto" />
        </div>
        
        <!-- Navigation Links (Desktop) -->
        <div class="hidden md:flex space-x-8 items-center">
          <a href="#beneficios" class="text-gray-600 hover:text-whatsapp font-medium transition-colors">Benefícios</a>
          <a href="#como-funciona" class="text-gray-600 hover:text-whatsapp font-medium transition-colors">Como Funciona</a>
          <a href="#" class="text-gray-600 hover:text-whatsapp font-medium transition-colors">Documentação</a>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <router-link to="/login" class="text-gray-600 hover:text-gray-900 font-semibold px-4 py-2 transition-colors">Login</router-link>
          <router-link to="/register" class="bg-whatsapp hover:bg-whatsapp-dark text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Cadastre-se</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
