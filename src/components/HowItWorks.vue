<script setup>
</script>

<template>
  <div id="como-funciona" class="bg-white py-24 sm:py-32 overflow-hidden relative">
    <!-- Decorator -->
    <div class="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
      <div class="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-whatsapp-light to-whatsapp opacity-20" style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)"></div>
    </div>
    
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Como Funciona a VapZap</h2>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          De um QR Code ao seu sistema funcionando perfeitamente. Siga estes passos simples para começar a automatizar sua comunicação.
        </p>
      </div>

      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-4 sm:gap-8 relative">
          
          <!-- Connecting Line -->
          <div class="hidden lg:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gray-100 z-0"></div>

          <!-- Step 1 -->
          <div class="relative z-10 text-center flex flex-col items-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl shadow-whatsapp/20 ring-1 ring-gray-900/5 text-whatsapp font-bold text-2xl mb-6">
              1
            </div>
            <h3 class="text-xl font-semibold leading-7 text-gray-900">Crie uma Instância</h3>
            <p class="mt-4 text-base leading-7 text-gray-600">
              Acesse o dashboard e crie uma nova sessão para o seu celular.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="relative z-10 text-center flex flex-col items-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl shadow-whatsapp/20 ring-1 ring-gray-900/5 text-whatsapp font-bold text-2xl mb-6">
              2
            </div>
            <h3 class="text-xl font-semibold leading-7 text-gray-900">Leia o QR Code</h3>
            <p class="mt-4 text-base leading-7 text-gray-600">
              Escaneie o código com seu WhatsApp como no WhatsApp Web.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="relative z-10 text-center flex flex-col items-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl shadow-whatsapp/20 ring-1 ring-gray-900/5 text-whatsapp font-bold text-2xl mb-6">
              3
            </div>
            <h3 class="text-xl font-semibold leading-7 text-gray-900">Configure Webhooks</h3>
            <p class="mt-4 text-base leading-7 text-gray-600">
              Indique a URL do seu sistema para receber as mensagens recebidas.
            </p>
          </div>

          <!-- Step 4 -->
          <div class="relative z-10 text-center flex flex-col items-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-whatsapp shadow-xl shadow-whatsapp/40 text-white font-bold text-2xl mb-6 transform scale-110">
              4
            </div>
            <h3 class="text-xl font-semibold leading-7 text-gray-900">Envie Mensagens</h3>
            <p class="mt-4 text-base leading-7 text-gray-600">
              Tudo pronto! Seu sistema já pode usar a API REST para interagir.
            </p>
          </div>

        </div>
      </div>
      
      <div class="mt-20 flex justify-center">
        <button class="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200">
          Criar minha conta agora
        </button>
      </div>

    </div>
  </div>
</template>
