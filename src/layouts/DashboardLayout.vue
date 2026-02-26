<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const router = useRouter();
const route = useRoute();
const user = ref({ name: 'Samuel', email: '' });

const handleLogout = () => {
  localStorage.removeItem('vapzap_token');
  router.push('/login');
};

// Based on user feedback: "na tela de conexões ainda nao apareceu a navbar"
const showTopbar = computed(() => {
  return true; // Always show navbar
});
</script>

<template>
  <div class="h-screen flex bg-[#f8f9fc] overflow-hidden text-sm font-sans">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <!-- Conditional Topbar -->
      <header v-if="showTopbar" class="bg-white border-b border-gray-100 h-[72px] flex items-center justify-between px-6 shrink-0 z-10 shadow-sm relative">
        <div class="flex items-center gap-4">
          <div class="flex items-center text-gray-400 gap-2">
            <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <span class="text-gray-400 font-medium hidden sm:block">Pages / <span class="text-gray-900 font-bold tracking-tight">{{ route.name === 'Dashboard' ? 'Dashboard' : route.name === 'InstanceDetails' ? 'Instância ' + route.params.name : route.name }}</span></span>
        </div>

        <div class="flex items-center gap-5">
          <!-- Search -->
          <div class="relative hidden lg:block">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input type="text" class="block w-[280px] pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-whatsapp/20 focus:border-whatsapp sm:text-sm transition-all duration-200" placeholder="Pesquisar...">
          </div>

          <div class="flex items-center gap-1.5 lg:border-l lg:border-gray-200 lg:pl-5">
            <!-- Actions -->
            <button class="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-50 transition-colors relative">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
  
            <!-- User dropdown (kept basic since it's also in sidebar bottom, but requested to keep format) -->
            <div class="relative group ml-1">
              <button class="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition-colors">
                 <div class="w-8 h-8 rounded-full bg-whatsapp text-white font-bold flex items-center justify-center shadow-sm">
                   S
                 </div>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div class="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="p-1">
                  <button @click="router.push('/dashboard/profile')" class="block w-full text-left px-3 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors">Meu Perfil</button>
                  <button @click="handleLogout" class="block w-full text-left px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors mt-1">Sair da conta</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-10">
        <div :class="route.name === 'Dashboard' ? 'max-w-5xl mx-auto' : 'max-w-[1400px] mx-auto'">
           <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
