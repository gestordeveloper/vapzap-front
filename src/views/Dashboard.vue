<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const instances = ref([]);
const loading = ref(true);

const fetchInstances = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('vapzap_token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/instance/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    instances.value = response.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('vapzap_token');
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchInstances());
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Dashboard Overview</h2>
    
    <div v-if="loading" class="animate-pulse flex gap-4">
      <div class="h-[140px] w-full sm:w-72 bg-gray-200 rounded-2xl"></div>
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col hover:border-whatsapp/30 transition-colors">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-whatsapp/10 flex items-center justify-center text-whatsapp shadow-sm">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Instâncias</span>
            </div>
          </div>
          <div class="text-5xl font-black text-gray-900 mb-1 tracking-tight">{{ instances.length }}</div>
          <p class="text-sm text-gray-500 font-medium mt-auto pt-2 border-t border-gray-50 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-whatsapp animate-pulse"></span>
            Total de conexões criadas
          </p>
      </div>
    </div>
  </div>
</template>
