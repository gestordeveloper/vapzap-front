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
        <div class="flex items-center gap-4"></div>

        <div class="flex items-center gap-5">
          <div class="flex items-center gap-1.5">  
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
      <main :class="['flex-1 overflow-y-auto relative', route.name === 'GlobalChats' || route.name === 'InstanceChats' ? 'p-0' : 'p-6 md:p-10']">
         <div :class="route.name === 'Dashboard' ? 'max-w-5xl mx-auto' : route.name === 'GlobalChats' || route.name === 'InstanceChats' ? 'h-full' : 'max-w-[1400px] mx-auto'">
            <router-view />
         </div>
      </main>
    </div>
  </div>
</template>
