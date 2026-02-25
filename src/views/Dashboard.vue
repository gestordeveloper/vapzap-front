<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const user = ref({ name: 'Usuário', email: '' });
const instances = ref([]);
const loading = ref(true);

// Create Modal State
const isCreateModalOpen = ref(false);
const newInstanceName = ref('');
const isCreating = ref(false);
const createError = ref('');

const handleLogout = () => {
  localStorage.removeItem('vapzap_token');
  router.push('/login');
};

const fetchInstances = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('vapzap_token');
    
    // Na vida real você pegaria os dados de '/auth/me', mas podemos recuperar o nome do token
    user.value.name = 'Samuel'; 
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/instance/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    instances.value = response.data;
  } catch (err) {
    console.error('Failed to fetch instances', err);
    if (err.response && err.response.status === 401) {
      handleLogout();
    }
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isCreateModalOpen.value = true;
  newInstanceName.value = '';
  createError.value = '';
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
};

const createNewInstance = async () => {
  if (!newInstanceName.value.trim()) {
    createError.value = 'O nome da conexão é obrigatório.';
    return;
  }
  
  isCreating.value = true;
  createError.value = '';
  
  try {
    const token = localStorage.getItem('vapzap_token');
    await axios.post(`${import.meta.env.VITE_API_URL}/instance/create`, 
      { name: newInstanceName.value }, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    closeCreateModal();
    await fetchInstances(); // Refresh list
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      createError.value = err.response.data.error;
    } else {
      createError.value = 'Erro ao criar a conexão.';
    }
  } finally {
    isCreating.value = false;
  }
};

const deleteInstance = async (instanceName) => {
  const confirmed = confirm(`Tem certeza que deseja excluir a instância "${instanceName}"?\n\nIsso irá desconectar o WhatsApp e apagar os arquivos da sessão. Esta ação não pode ser desfeita.`);
  if (!confirmed) return;
  
  try {
    const token = localStorage.getItem('vapzap_token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/instance/${instanceName}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Remove from UI immediately for snappiness, or just re-fetch
    await fetchInstances();
  } catch (err) {
    console.error('Failed to delete instance', err);
    alert('Erro ao excluir a instância. Tente novamente.');
  }
};

onMounted(() => {
  fetchInstances();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center gap-2">
            <img src="/logo.svg" alt="VapZap Logo" class="h-8 w-auto" />
          </div>
          <div class="flex items-center gap-6">
             <!-- Navigation Links -->
             <div class="hidden sm:flex items-center gap-4 border-r border-gray-200 pr-6">
                <button @click="router.push('/dashboard')" class="text-sm font-medium text-whatsapp transition-colors">Painel</button>
                <button @click="router.push('/dashboard/api')" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Documentação API</button>
             </div>
             <!-- User & Logout -->
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

    <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      <!-- Welcome & Action Button -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Olá, {{ user.name }}! Bora conectar?
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Gerencie todas as suas instâncias do WhatsApp em um só lugar.
          </p>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <button @click="openCreateModal" type="button" class="ml-3 inline-flex items-center gap-x-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-whatsapp-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp transition-all duration-200 transform hover:-translate-y-0.5">
            <svg class="-ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Nova Conexão
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp"></div>
      </div>

      <!-- Instances -->
      <div v-else>
        <!-- Empty State -->
        <div v-if="instances.length === 0" class="text-center bg-white rounded-2xl border border-gray-200 py-16 px-6 shadow-sm">
          <div class="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <svg class="w-8 h-8 text-whatsapp" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
             </svg>
          </div>
          <h3 class="mt-2 text-lg font-semibold text-gray-900">Nenhuma conexão encontrada</h3>
          <p class="mt-1 text-sm text-gray-500 max-w-sm mx-auto">Você ainda não tem nenhuma conexão. Bora iniciar uma agora para começar a automatizar suas mensagens?</p>
          <div class="mt-6">
            <button @click="openCreateModal" type="button" class="inline-flex items-center rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-whatsapp-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp">
              Criar Primeira Conexão
            </button>
          </div>
        </div>

        <!-- Instance Grid -->
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="instance in instances" :key="instance.id" class="col-span-1 divide-y divide-gray-200 rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex w-full items-center justify-between space-x-6 p-6">
              <div class="flex-1 truncate">
                <div class="flex items-center space-x-3">
                  <h3 class="truncate text-lg font-bold text-gray-900">{{ instance.name }}</h3>
                  <span :class="[
                      instance.status === 'CONNECTED' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                      instance.status === 'CONNECTING' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : 
                      'bg-red-50 text-red-700 ring-red-600/10',
                      'inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                    ]">
                    {{ instance.status === 'CONNECTED' ? 'Conectado' : instance.status === 'CONNECTING' ? 'Conectando...' : 'Desconectado' }}
                  </span>
                </div>
                <p class="mt-1 truncate text-sm text-gray-500">ID: {{ instance.id.split('-')[0] }}...</p>
              </div>
              <div class="flex flex-shrink-0 items-center justify-center w-12 h-12 bg-gray-50 rounded-full">
                 <svg :class="instance.status === 'CONNECTED' ? 'text-whatsapp' : 'text-gray-400'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                 </svg>
              </div>
            </div>
            <div>
              <div class="-mt-px flex divide-x divide-gray-200">
                <div class="flex w-0 flex-1">
                  <button @click="router.push(`/dashboard/instance/${instance.name}`)" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-2xl border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    Detalhes
                  </button>
                </div>
                <div class="-ml-px flex w-0 flex-1">
                  <button @click="deleteInstance(instance.name)" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-2xl border-transparent py-4 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                    </svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Create Instance Modal -->
    <div v-if="isCreateModalOpen" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-whatsapp" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Nova Conexão</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 mb-4">Dê um nome para identificar o seu número de WhatsApp no sistema.</p>
                    
                    <div>
                      <label for="instanceName" class="sr-only">Nome da Conexão</label>
                      <input type="text" id="instanceName" v-model="newInstanceName" placeholder="Ex: Atendimento Suporte" class="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6">
                      <p v-if="createError" class="mt-2 text-sm text-red-600" id="name-error">{{ createError }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button @click="createNewInstance" :disabled="isCreating" type="button" class="inline-flex w-full justify-center rounded-lg bg-whatsapp px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-whatsapp-dark sm:ml-3 sm:w-auto disabled:opacity-75 disabled:cursor-not-allowed">
                <span v-if="isCreating">Criando...</span>
                <span v-else>Criar Conexão</span>
              </button>
              <button @click="closeCreateModal" :disabled="isCreating" type="button" class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-75 disabled:cursor-not-allowed">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
