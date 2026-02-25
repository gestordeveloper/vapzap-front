<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const instanceNameParam = route.params.name;

const user = ref({ name: 'Samuel', email: '' });
const instance = ref(null);
const loading = ref(true);
const error = ref('');

const handleLogout = () => {
  localStorage.removeItem('vapzap_token');
  router.push('/login');
};

// Connection state
const qrCode = ref('');
const isConnecting = ref(false);

// Edit state
const newName = ref('');
const webhookUrl = ref('');
const isSaving = ref(false);
const saveMessage = ref('');

const fetchInstance = async () => {
  try {
    const token = localStorage.getItem('vapzap_token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/instance/${instanceNameParam}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    instance.value = response.data;
    newName.value = instance.value.name;
    webhookUrl.value = instance.value.webhookUrl || '';
  } catch (err) {
    if (err.response && err.response.status === 401) {
      router.push('/login');
    } else {
      error.value = 'Failed to load instance details.';
    }
  } finally {
    loading.value = false;
  }
};

const copyId = async () => {
  if (instance.value && instance.value.id) {
    try {
      await navigator.clipboard.writeText(instance.value.id);
      saveMessage.value = 'ID copiado!';
      setTimeout(() => saveMessage.value = '', 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }
};

const generateQrCode = async () => {
  if (!instance.value) return;
  isConnecting.value = true;
  qrCode.value = '';
  
  try {
    const token = localStorage.getItem('vapzap_token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/instance/connect/${instance.value.name}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.qrCode) {
       // QR Code is a base64 string
       qrCode.value = response.data.qrCode;
    }
    
    // Also update instance status if needed
    await fetchInstance();
  } catch (err) {
    console.error('Failed to generate QR Code', err);
    alert('Erro ao gerar QR Code.');
  } finally {
    isConnecting.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  saveMessage.value = '';
  const token = localStorage.getItem('vapzap_token');
  
  try {
    // Save New Name if changed
    if (newName.value && newName.value !== instance.value.name) {
       await axios.put(`${import.meta.env.VITE_API_URL}/instance/${instance.value.name}`, 
          { newName: newName.value },
          { headers: { Authorization: `Bearer ${token}` }}
       );
       // We must update the URL parameter if the name changes, or redirect. 
       // For simplicity, we just redirect to the new name URL.
       router.replace(`/dashboard/instance/${newName.value}`);
       instance.value.name = newName.value;
    }
    
    // Save Webhook
    await axios.post(`${import.meta.env.VITE_API_URL}/instance/webhook/${instance.value.name}`,
       { webhookUrl: webhookUrl.value },
       { headers: { Authorization: `Bearer ${token}` }}
    );
    
    saveMessage.value = 'Configurações salvas com sucesso!';
    setTimeout(() => saveMessage.value = '', 3000);
    await fetchInstance();
  } catch (err) {
    console.error('Failed to save settings', err);
    saveMessage.value = 'Erro ao salvar configurações.';
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchInstance();
});

</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" @click="router.push('/dashboard')">
            <div class="w-8 h-8 bg-whatsapp rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900 tracking-tight">VapZap</span>
          </div>
          <!-- Navigation & User -->
          <div class="flex items-center gap-6">
             <!-- Links -->
             <div class="hidden sm:flex items-center gap-4 border-r border-gray-200 pr-6">
                <button @click="router.push('/dashboard')" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Painel</button>
                <button @click="router.push('/dashboard/api')" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Documentação API</button>
             </div>
             <!-- User Info -->
             <div class="relative group">
                <button class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                  <span class="hidden sm:block">{{ user.name }}</span>
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <!-- Dropdown Menu -->
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <div class="py-1">
                      <button @click="router.push('/dashboard/profile')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Meu Perfil</button>
                      <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sair da conta</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow max-w-5xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      
      <!-- Voltar -->
      <div class="mb-6">
         <button @click="router.push('/dashboard')" class="text-gray-500 hover:text-whatsapp transition-colors flex items-center gap-2 text-sm font-medium">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             <span>Voltar ao Painel</span>
         </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp"></div>
      </div>
      
      <div v-else-if="error" class="text-center py-20 text-red-600 bg-red-50 rounded-2xl border border-red-100">
         <h3 class="text-lg font-bold">{{ error }}</h3>
      </div>
      
      <div v-else-if="instance">
        <!-- Page Title & Status -->
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="min-w-0 flex-1 flex items-center gap-4">
            <h2 class="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
              {{ instance.name }}
            </h2>
            <span :class="[
                instance.status === 'CONNECTED' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                instance.status === 'CONNECTING' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : 
                'bg-red-50 text-red-700 ring-red-600/10',
                'inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset'
              ]">
              {{ instance.status === 'CONNECTED' ? 'Conectado' : instance.status === 'CONNECTING' ? 'Conectando...' : 'Desconectado' }}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Connection & QR Code -->
          <div class="lg:col-span-1 space-y-8">
             <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                   <h3 class="text-lg font-semibold text-gray-900">Conexão Vapzap</h3>
                </div>
                <div class="p-6 text-center">
                   <div v-if="qrCode" class="flex justify-center mb-6">
                      <img :src="qrCode" alt="QR Code" class="w-64 h-64 border rounded-lg shadow-sm" />
                   </div>
                   <div v-else-if="instance.status === 'CONNECTED'" class="flex flex-col items-center justify-center py-8">
                      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                         <svg class="w-10 h-10 text-whatsapp" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p class="text-green-800 font-medium">WhatsApp Conectado</p>
                   </div>
                   <div v-else class="flex flex-col items-center justify-center py-8">
                      <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                         <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                      </div>
                      <p class="text-gray-500 text-sm mb-6">Gere o QR Code e escaneie com seu celular para conectar.</p>
                      <button @click="generateQrCode" :disabled="isConnecting" class="w-full inline-flex justify-center items-center rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-whatsapp-dark disabled:opacity-50">
                         <span v-if="isConnecting" class="flex items-center gap-2">
                           <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           Gerando...
                         </span>
                         <span v-else>Gerar QR Code</span>
                      </button>
                   </div>
                </div>
             </div>
          </div>
          
          <!-- Right Column: Settings & Info -->
          <div class="lg:col-span-2 space-y-8">
             
             <!-- Info Card -->
             <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                   <h4 class="text-sm font-medium text-gray-500">Instance ID</h4>
                   <p class="text-gray-900 font-mono text-sm mt-1 select-all">{{ instance.id }}</p>
                </div>
                <button @click="copyId" class="inline-flex items-center gap-2 text-sm font-semibold text-whatsapp hover:text-whatsapp-dark bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                   Copiar ID
                </button>
             </div>
             
             <!-- Settings Card -->
             <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                   <h3 class="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
                </div>
                <div class="p-6 space-y-6 flex flex-col">
                   <div>
                      <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Nome da Instância</label>
                      <div class="mt-2">
                         <input type="text" id="name" v-model="newName" class="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6">
                      </div>
                   </div>
                   
                   <div>
                      <label for="webhook" class="block text-sm font-medium leading-6 text-gray-900">Webhook URL (Receber mensagens)</label>
                      <div class="mt-2">
                         <input type="url" id="webhook" v-model="webhookUrl" placeholder="https://seu-sistema.com/webhook" class="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6">
                      </div>
                   </div>
                   
                   <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span class="text-sm text-green-600 font-medium transition-opacity duration-300" :class="saveMessage ? 'opacity-100' : 'opacity-0'">{{ saveMessage }}</span>
                      <button @click="saveSettings" :disabled="isSaving" class="inline-flex justify-center items-center rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50">
                         <span v-if="isSaving">Salvando...</span>
                         <span v-else>Salvar Alterações</span>
                      </button>
                   </div>
                </div>
             </div>
             
          </div>

        </div>
      </div>
    </main>
  </div>
</template>
