<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Conexões', path: '/dashboard/connections', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { name: 'Documentação', path: '/dashboard/api', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const handleLogout = () => {
  localStorage.removeItem('vapzap_token');
  router.push('/login');
};
</script>

<template>
  <aside class="w-[260px] bg-[#fdfdfd] border-r border-gray-100 flex flex-col h-full shrink-0">
    <!-- Logo -->
    <div class="h-[72px] flex items-center justify-center px-6 shrink-0 border-b border-gray-100">
      <img src="/logo.svg" alt="VapZap Logo" class="h-8 w-auto cursor-pointer" @click="$router.push('/dashboard')" />
    </div>

    <!-- Navigation List -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-6 space-y-1">
      <router-link v-for="item in navItems" :key="item.name" :to="item.path" custom v-slot="{ isActive, isExactActive, navigate }">
        <button @click="navigate" :class="[(item.path === '/dashboard' ? isExactActive : isActive) ? 'bg-whatsapp/10 text-whatsapp font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium', 'w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors']">
          <div class="flex items-center gap-3">
            <svg :class="[(item.path === '/dashboard' ? isExactActive : isActive) ? 'text-whatsapp' : 'text-gray-400']" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
            </svg>
            <span class="text-[14px] tracking-tight truncate">{{ item.name }}</span>
          </div>
        </button>
      </router-link>
    </div>
  </aside>
</template>
