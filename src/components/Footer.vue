<script setup>
</script>

<template>
  <footer class="bg-white border-t border-gray-100">
    <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
      <div class="flex justify-center space-x-6 md:order-2">
        <a href="#" class="text-gray-400 hover:text-whatsapp transition-colors">
          <span class="sr-only">Termos de Uso</span>
          Termos
        </a>
        <a href="#" class="text-gray-400 hover:text-whatsapp transition-colors">
          <span class="sr-only">Privacidade</span>
          Privacidade
        </a>
        <a href="#" class="text-gray-400 hover:text-whatsapp transition-colors">
          <span class="sr-only">Documentação</span>
          Documentação
        </a>
      </div>
      <div class="mt-8 md:order-1 md:mt-0">
        <div class="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-0">
          <svg class="w-5 h-5 text-whatsapp" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p class="text-center text-sm leading-5 text-gray-500 font-semibold tracking-tight">
            VapZap API
          </p>
        </div>
        <p class="text-center text-sm leading-5 text-gray-400 md:text-left mt-2 md:mt-0">
          &copy; {{ new Date().getFullYear() }} VapZap. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>
