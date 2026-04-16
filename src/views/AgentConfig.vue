<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const instanceNameParam = route.params.name;

const agentName = ref('Agente IA');
const objective = ref('');
const processText = ref('');
const observations = ref('');
const isActive = ref(true);

const loading = ref(true);
const isSaving = ref(false);
const saveMessage = ref('');
const saveError = ref('');

const fetchAgent = async () => {
  try {
    const token = localStorage.getItem('vapzap_token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/instance/agent/${instanceNameParam}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const agent = response.data;
    if (agent) {
      agentName.value = agent.name || 'Agente IA';
      objective.value = agent.objective || '';
      processText.value = agent.process || '';
      observations.value = agent.observations || '';
      if (agent.isActive !== undefined) isActive.value = agent.isActive;
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      router.push('/login');
    }
    console.error('Failed to fetch agent', err);
  } finally {
    loading.value = false;
  }
};

const saveAgent = async () => {
  isSaving.value = true;
  saveMessage.value = '';
  saveError.value = '';
  const token = localStorage.getItem('vapzap_token');
  
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/instance/agent/${instanceNameParam}`,
       { 
         agentName: agentName.value, 
         objective: objective.value,
         process: processText.value,
         observations: observations.value,
         isActive: isActive.value
       },
       { headers: { Authorization: `Bearer ${token}` }}
    );
    
    saveMessage.value = 'Configurações de IA salvas com sucesso!';
    setTimeout(() => saveMessage.value = '', 4000);
  } catch (err) {
    console.error('Failed to save settings', err);
    saveError.value = 'Erro ao salvar configurações do agente.';
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchAgent();
});

</script>

<template>
  <div class="min-h-screen bg-transparent flex flex-col pb-12">

    <main class="flex-grow max-w-5xl w-full py-8">
      
      <!-- Voltar -->
      <div class="mb-6">
         <button @click="router.push(`/dashboard/instance/${instanceNameParam}`)" class="text-gray-500 hover:text-whatsapp transition-colors flex items-center gap-2 text-sm font-medium">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             <span>Voltar para Instância</span>
         </button>
      </div>

      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="min-w-0 flex-1 flex flex-col">
          <h2 class="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight mb-2">
             Configuração do Agente IA
          </h2>
          <p class="text-gray-500 text-sm">Configure o prompt, diretrizes e o modo de operação do agente de inteligência artificial para a conexão <strong>{{ instanceNameParam }}</strong>.</p>
        </div>
      </div>
      
      <div v-if="loading" class="flex justify-center items-center py-20">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp"></div>
      </div>
      
      <div v-else class="space-y-8">
         <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center sm:flex-row flex-col sm:items-start text-center sm:text-left">
               <div>
                  <h3 class="text-lg font-semibold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                    <svg class="w-5 h-5 text-whatsapp" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    Parâmetros do Agente
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">Defina as diretrizes de prompt que serão utilizadas integradas ao RAG e n8n.</p>
               </div>
               <div class="mt-4 sm:mt-0 flex items-center">
                  <button type="button" @click="isActive = !isActive" :class="isActive ? 'bg-whatsapp' : 'bg-gray-200'" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-whatsapp focus:ring-offset-2" role="switch" :aria-checked="isActive">
                    <span class="sr-only">Ativar Agente</span>
                    <span aria-hidden="true" :class="isActive ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                  <span class="ml-3 text-sm font-medium text-gray-900 w-24 text-left" id="agent-active-label">
                     <span v-if="isActive" class="text-green-600">Agente Ativo</span>
                     <span v-else class="text-gray-500">Inativo</span>
                  </span>
               </div>
            </div>
            
            <div class="p-6 space-y-6 flex flex-col">
               
               <div>
                  <label for="agentName" class="block text-sm font-bold leading-6 text-gray-900">Nome do Agente (Identidade)</label>
                  <p class="text-xs text-gray-500 mb-2">Como seu agente deve ser chamado internamente ou como deve se apresentar.</p>
                  <input type="text" id="agentName" v-model="agentName" placeholder="Ex: Assistente de Vendas Vapzap..." class="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6">
               </div>
               
               <div>
                  <label for="objective" class="block text-sm font-bold leading-6 text-gray-900">Objetivo e Função</label>
                  <p class="text-xs text-gray-500 mb-2">Qual é o papel principal que este agente irá desempenhar? (ex: "Oferecer suporte técnico, qualificar leads, tirar dúvidas de preços").</p>
                  <textarea id="objective" v-model="objective" rows="4" placeholder="Descreva aqui o propósito principal do agente..." class="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6"></textarea>
               </div>
               
               <div>
                  <label for="processText" class="block text-sm font-bold leading-6 text-gray-900">Processo e Atendimento</label>
                  <p class="text-xs text-gray-500 mb-2">Quais são as instruções de processo passo-a-passo? Como ele deve tratar o cliente? Como coletar informações?</p>
                  <textarea id="processText" v-model="processText" rows="6" placeholder="Ex: 1. Cumprimente informalmente o lead. 2. Descubra sua necessidade. 3. Peça o e-mail..." class="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6"></textarea>
               </div>
               
               <div>
                  <label for="observations" class="block text-sm font-bold leading-6 text-gray-900">Observações e Considerações Finais</label>
                  <p class="text-xs text-gray-500 mb-2">Restrições (o que ele não deve fazer, como "não forneça descontos não autorizados") e tom de voz.</p>
                  <textarea id="observations" v-model="observations" rows="4" placeholder="Ex: Seja conciso. Nunca invente informações se não souber. Nunca passe valores." class="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6"></textarea>
               </div>
               
            </div>
            
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
               <div>
                  <span v-if="saveMessage" class="text-sm text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-2">
                     <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                     {{ saveMessage }}
                  </span>
                  <span v-if="saveError" class="text-sm text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-2">
                     <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                     {{ saveError }}
                  </span>
               </div>
               <button @click="saveAgent" :disabled="isSaving" class="inline-flex justify-center items-center rounded-lg bg-whatsapp px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-whatsapp-dark disabled:opacity-50 transition-colors">
                  <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span v-if="isSaving">Salvando...</span>
                  <span v-else>Salvar Prompt IA</span>
               </button>
            </div>
         </div>
      </div>
    </main>
  </div>
</template>
