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
          <img src="/logo.svg" alt="VapZap Logo" class="h-6 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
        </div>
        <p class="text-center text-sm leading-5 text-gray-400 md:text-left mt-2 md:mt-0">
          &copy; {{ new Date().getFullYear() }} VapZap. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>
