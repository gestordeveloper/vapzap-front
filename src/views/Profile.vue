<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({ name: 'Carregando...', email: '...' });
const apiToken = ref('');
const isTokenVisible = ref(false);

onMounted(() => {
  const token = localStorage.getItem('vapzap_token');
  if (!token) {
    router.push('/login');
    return;
  }
  
  apiToken.value = token;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user.value.name = payload.name || 'Samuel';
    user.value.email = payload.email || 'samuel@example.com'; 
  } catch (err) {
    console.error('Failed to decode JWT', err);
    user.value.name = 'Usuário';
  }
});

const handleLogout = () => {
  localStorage.removeItem('vapzap_token');
  router.push('/login');
};

const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(apiToken.value);
    const btn = document.getElementById('btn-copy-token');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Copiado!';
      btn.classList.add('bg-whatsapp', 'text-white');
      btn.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      setTimeout(() => {
         btn.innerHTML = originalText;
         btn.classList.remove('bg-whatsapp', 'text-white');
         btn.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy', err);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" @click="router.push('/dashboard')">
            <img src="/logo.svg" alt="VapZap Logo" class="h-8 w-auto" />
          </div>
          <div class="flex items-center gap-6">
             <!-- Navigation Links -->
             <div class="hidden sm:flex items-center gap-4 border-r border-gray-200 pr-6">
                <button @click="router.push('/dashboard')" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Painel</button>
                <button @click="router.push('/dashboard/api')" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Documentação API</button>
             </div>
             <!-- User & Logout -->
             <div class="flex items-center gap-4">
               <span class="text-sm font-medium text-gray-900 hidden sm:block">{{ user.name }}</span>
               <button @click="handleLogout" class="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md">Sair</button>
             </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      
      <!-- Voltar -->
      <div class="mb-6">
         <button @click="router.push('/dashboard')" class="text-gray-500 hover:text-whatsapp transition-colors flex items-center gap-2 text-sm font-medium">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             <span>Voltar ao Painel</span>
         </button>
      </div>

      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold leading-9 text-gray-900 sm:truncate sm:tracking-tight">Meu Perfil</h1>
        <p class="text-sm text-gray-500 mt-1">Gerencie suas informações de conta e acesso à API.</p>
      </div>

      <div class="space-y-6">
        
        <!-- User Info Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
          </div>
          <div class="p-6">
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                   <input type="text" disabled :value="user.name" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm">
                </div>
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                   <input type="email" disabled :value="user.email" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm">
                </div>
             </div>
          </div>
        </div>

        <!-- API Token Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <div>
               <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                  Token de API (JWT)
               </h3>
               <p class="text-sm text-gray-500 mt-1">Utilize este token para autenticar suas requisições na <a @click.prevent="router.push('/dashboard/api')" href="#" class="text-whatsapp hover:underline">API do VapZap</a>.</p>
            </div>
          </div>
          <div class="p-6">
             <div class="bg-gray-900 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-inner">
                <div class="flex-grow w-full overflow-hidden">
                   <div class="font-mono text-sm text-gray-300 break-all select-all">
                      {{ isTokenVisible ? apiToken : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••' }}
                   </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                   <button @click="isTokenVisible = !isTokenVisible" class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800" :title="isTokenVisible ? 'Ocultar Token' : 'Mostrar Token'">
                      <svg v-if="!isTokenVisible" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                   </button>
                   <button id="btn-copy-token" @click="copyToken" class="text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      Copiar Token
                   </button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>
