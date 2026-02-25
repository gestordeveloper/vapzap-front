<script setup>
</script>

<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 items-center">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer">
          <div class="w-10 h-10 bg-whatsapp rounded-xl flex items-center justify-center shadow-lg shadow-whatsapp/30">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <span class="text-2xl font-extrabold text-gray-900 tracking-tight">Vap<span class="text-whatsapp">Zap</span></span>
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
