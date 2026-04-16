<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const instances = ref([]);
const loading = ref(true);

// Create Modal State
const isCreateModalOpen = ref(false);
const newInstanceName = ref('');
const isCreating = ref(false);
const createError = ref('');

const fetchInstances = async (silent = false) => {
  if (!silent) loading.value = true;
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
    if (!silent) loading.value = false;
  }
};

const openCreateModal = () => {
  isCreateModalOpen.value = true;
  newInstanceName.value = '';
  createError.value = '';
};
const closeCreateModal = () => isCreateModalOpen.value = false;

const createNewInstance = async () => {
  if (!newInstanceName.value.trim()) {
    createError.value = 'O nome da conexão é obrigatório.';
    return;
  }
  isCreating.value = true;
  createError.value = '';
  try {
    const token = localStorage.getItem('vapzap_token');
    await axios.post(`${import.meta.env.VITE_API_URL}/instance/create`, { name: newInstanceName.value }, { headers: { Authorization: `Bearer ${token}` }});
    closeCreateModal();
    await fetchInstances();
  } catch (err) {
    createError.value = err.response?.data?.error || 'Erro ao criar a conexão.';
  } finally {
    isCreating.value = false;
  }
};

const deleteInstance = async (instanceName) => {
  if (!confirm(`Tem certeza que deseja excluir a instância "${instanceName}"?`)) return;
  try {
    const token = localStorage.getItem('vapzap_token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/instance/${instanceName}`, { headers: { Authorization: `Bearer ${token}` } });
    await fetchInstances();
  } catch (err) {
    alert('Erro ao excluir a instância. Tente novamente.');
  }
};

let refreshInterval = null;

onMounted(() => {
  fetchInstances();
  refreshInterval = setInterval(() => {
    // Silent fetch
    fetchInstances(true);
  }, 5000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>

<template>
  <div class="pb-12">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Gerenciar Conexões</h2>
        <p class="text-sm text-gray-500 mt-1">Conecte e administre seus números de WhatsApp corporativos.</p>
      </div>
      <button @click="openCreateModal" class="bg-whatsapp text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-whatsapp-dark hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 whitespace-nowrap">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nova Conexão
      </button>
    </div>

    <!-- loading state -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp"></div>
    </div>
    
    <div v-else>
      <div v-if="instances.length === 0" class="text-center bg-white rounded-2xl border border-dashed border-gray-300 py-16 px-6">
        <div class="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-whatsapp" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 class="mt-2 text-lg font-bold text-gray-900">Nenhuma conexão adicionada</h3>
        <p class="mt-1 text-sm text-gray-500 mb-6 font-medium">Você ainda não tem instâncias do WhatsApp configuradas.</p>
        <button @click="openCreateModal" class="bg-whatsapp text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-whatsapp-dark transition-colors inline-flex items-center gap-2">
          Criar Primeira Conexão
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="instance in instances" :key="instance.id" class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.1)] transition-all duration-200">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-12 h-12 rounded-xl bg-whatsapp/10 flex items-center justify-center shrink-0 border border-whatsapp/20">
               <svg class="w-6 h-6 text-whatsapp-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
               </svg>
            </div>
            <div class="flex-1 truncate">
              <h4 class="font-bold text-gray-900 text-base truncate">{{ instance.name }}</h4>
              <p class="text-[11px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">ID: {{ instance.id.split('-')[0] }}</p>
            </div>
            <span :class="[
                instance.status === 'CONNECTED' ? 'bg-green-50 text-green-600' : 
                instance.status === 'CONNECTING' ? 'bg-yellow-50 text-yellow-600' : 
                'bg-red-50 text-red-600',
                'px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider shrink-0'
              ]"
              :style="instance.status === 'CONNECTED' ? 'border-color: #dcfce7;' : instance.status === 'CONNECTING' ? 'border-color: #fef08a;' : 'border-color: #fee2e2;'">
              {{ instance.status === 'CONNECTED' ? 'Connected' : instance.status === 'CONNECTING' ? 'Connecting' : 'Disconnected' }}
            </span>
          </div>
          
          <div class="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
             <button @click="$router.push(`/dashboard/instance/${instance.name}`)" class="flex-1 py-2 font-bold text-xs rounded-xl transition-colors border text-gray-700 bg-white border-gray-200 hover:bg-gray-50">
                Acessar Detalhes
             </button>
             <button @click="deleteInstance(instance.name)" class="w-10 h-10 flex items-center justify-center shrink-0 bg-red-50/50 hover:bg-red-50 text-red-600 rounded-xl border border-transparent hover:border-red-100 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Instance Modal -->
    <div v-if="isCreateModalOpen" class="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100">
            <div class="bg-white px-6 pb-6 pt-6">
               <div class="flex justify-between items-center mb-5">
                 <h3 class="text-xl font-bold text-gray-900 tracking-tight">Nova Conexão</h3>
                 <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
               </div>
               <div class="mt-2">
                 <p class="text-sm text-gray-500 mb-5 font-medium leading-relaxed">Preencha o nome da sua nova conexão para identificá-la no painel.</p>
                 <div>
                   <label for="instanceName" class="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 ml-1">Nome da Conexão</label>
                   <input type="text" id="instanceName" v-model="newInstanceName" placeholder="Ex: Atendimento Suporte" class="block w-full rounded-2xl border-gray-200 py-3.5 px-4 text-gray-900 shadow-sm focus:border-whatsapp focus:ring-whatsapp sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white focus:ring-2 focus:ring-offset-0 text-base">
                   <p v-if="createError" class="mt-2 text-sm text-red-600 font-bold whitespace-pre-wrap ml-1">{{ createError }}</p>
                 </div>
               </div>
            </div>
            <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-3xl border-t border-gray-100">
              <button @click="createNewInstance" :disabled="isCreating" type="button" class="inline-flex w-full sm:w-auto justify-center items-center rounded-xl bg-whatsapp px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-whatsapp-dark transition-colors focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span v-if="isCreating">Criando...</span>
                <span v-else>Criar Conexão</span>
              </button>
              <button @click="closeCreateModal" :disabled="isCreating" type="button" class="inline-flex w-full sm:w-auto justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
