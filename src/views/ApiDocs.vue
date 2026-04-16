<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Pegar o token do usuário e URL
const apiUrl = computed(() => {
  return import.meta.env.VITE_API_URL || window.location.origin;
});

const userAuthToken = computed(() => {
  return localStorage.getItem('vapzap_token') || 'SUA_CHAVE_AQUI';
});

const userObjectJSON = localStorage.getItem('vapzap_user');
const userObject = userObjectJSON ? JSON.parse(userObjectJSON) : {};
const apiToken = userObject.apiToken || 'SEU_TOKEN_API_AQUI';

const endpoints = [
  {
    id: 'visao-geral',
    group: 'VISÃO GERAL',
    title: 'Autenticação',
    method: '',
    path: '',
    description: 'Aprenda a autenticar as suas requisições com a API do VapZap.',
    pathParams: [],
    bodyParams: [],
    responseNotes: `Use o seu Token API em todas as requisições privadas no cabeçalho Authorization: Bearer SEU_TOKEN_API`,
    code: `curl --request GET \\
  --url '${apiUrl.value}/endpoint' \\
  --header 'Authorization: Bearer ${apiToken}'`,
    responseColor: 'text-gray-400',
    response: `{
  "message": "Token de Autenticação aceito!"
}`
  },
  {
    id: 'send-text',
    group: 'MENSAGENS',
    title: 'Enviar Mensagem de Texto',
    method: 'GET/POST', // We use POST for this, display as POST
    methodDisplay: 'POST',
    path: '/instance/sendText/{instanceName}',
    description: 'Envia uma mensagem de texto simples para um número de WhatsApp usando sua instância conectada.',
    pathParams: [
      { name: 'instanceName', type: 'string', required: true, description: 'Nome exato da instância criada no VapZap.' }
    ],
    bodyParams: [
      { name: 'number', type: 'string', required: true, description: 'Número de destino com DDI e DDD (ex: 5511999999999).' },
      { name: 'text', type: 'string', required: true, description: 'Texto da mensagem.' }
    ],
    code: `curl -X POST \\
  '${apiUrl.value}/instance/sendText/{instanceName}' \\
  -H 'Authorization: Bearer ${apiToken}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "number": "5511999999999",
    "text": "Olá! Esta é uma mensagem do VapZap."
}'`,
    responseColor: 'text-green-400',
    response: `{
  "message": "Message sent",
  "result": {
     "key": { ... },
     "message": { "conversation": "Olá..." }
  }
}`
  },
  {
    id: 'send-image',
    group: 'MENSAGENS',
    title: 'Enviar Imagem',
    methodDisplay: 'POST',
    path: '/instance/sendImage/{instanceName}',
    description: 'Envia uma imagem a partir de uma URL pública na internet.',
    pathParams: [
      { name: 'instanceName', type: 'string', required: true, description: 'Nome da instância.' }
    ],
    bodyParams: [
      { name: 'number', type: 'string', required: true, description: 'Número de destino (ex: 5511999999999).' },
      { name: 'url', type: 'string', required: true, description: 'URL pública da imagem.' },
      { name: 'caption', type: 'string', required: false, description: 'Legenda da imagem.' }
    ],
    code: `curl -X POST \\
  '${apiUrl.value}/instance/sendImage/{instanceName}' \\
  -H 'Authorization: Bearer ${apiToken}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "number": "5511999999999",
    "url": "https://img.com/imagem.png",
    "caption": "Legenda (Opcional)"
}'`,
    responseColor: 'text-green-400',
    response: `{ "message": "Message sent", "result": { ... } }`
  },
  {
    id: 'send-video',
    group: 'MENSAGENS',
    title: 'Enviar Vídeo',
    methodDisplay: 'POST',
    path: '/instance/sendVideo/{instanceName}',
    description: 'Envia um arquivo de vídeo (mp4) a partir de uma URL.',
    pathParams: [
      { name: 'instanceName', type: 'string', required: true, description: 'Nome da instância.' }
    ],
    bodyParams: [
      { name: 'number', type: 'string', required: true, description: 'Número de destino.' },
      { name: 'url', type: 'string', required: true, description: 'URL do vídeo MP4.' },
      { name: 'caption', type: 'string', required: false, description: 'Legenda.' }
    ],
    code: `curl -X POST \\
  '${apiUrl.value}/instance/sendVideo/{instanceName}' \\
  -H 'Authorization: Bearer ${apiToken}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "number": "5511999999999",
    "url": "https://vid.com/video.mp4"
}'`,
    responseColor: 'text-green-400',
    response: `{ "message": "Message sent" }`
  },
  {
    id: 'send-audio',
    group: 'MENSAGENS',
    title: 'Enviar Áudio (Voice Note)',
    methodDisplay: 'POST',
    path: '/instance/sendAudio/{instanceName}',
    description: 'Envia um arquivo MP3 que simula estar sendo gravado na hora.',
    pathParams: [
      { name: 'instanceName', type: 'string', required: true, description: 'Nome da instância.' }
    ],
    bodyParams: [
      { name: 'number', type: 'string', required: true, description: 'Número de destino.' },
      { name: 'url', type: 'string', required: true, description: 'URL pública do áudio MP3.' }
    ],
    code: `curl -X POST \\
  '${apiUrl.value}/instance/sendAudio/{instanceName}' \\
  -H 'Authorization: Bearer ${apiToken}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "number": "5511999999999",
    "url": "https://aud.com/audio.mp3"
}'`,
    responseColor: 'text-green-400',
    response: `{ "message": "Message sent" }`
  },
  {
    id: 'send-document',
    group: 'MENSAGENS',
    title: 'Enviar Documento',
    methodDisplay: 'POST',
    path: '/instance/sendDocument/{instanceName}',
    description: 'Envia um documento, PDF, tabela, a partir de um link.',
    pathParams: [
      { name: 'instanceName', type: 'string', required: true, description: 'Nome da instância.' }
    ],
    bodyParams: [
      { name: 'number', type: 'string', required: true, description: 'Número de destino.' },
      { name: 'url', type: 'string', required: true, description: 'URL do arquivo.' },
      { name: 'mimetype', type: 'string', required: true, description: 'O tipo mime. Ex: application/pdf' },
      { name: 'fileName', type: 'string', required: true, description: 'O nome que o arquivo terá no celular do destino.' },
      { name: 'caption', type: 'string', required: false, description: 'Legenda opcional.' }
    ],
    code: `curl -X POST \\
  '${apiUrl.value}/instance/sendDocument/{instanceName}' \\
  -H 'Authorization: Bearer ${apiToken}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "number": "5511999999999",
    "url": "https://docs.com/tabela.pdf",
    "mimetype": "application/pdf",
    "fileName": "TabelaAnual.pdf"
}'`,
    responseColor: 'text-green-400',
    response: `{ "message": "Message sent" }`
  },
  {
    id: 'connect-instance',
    group: 'INSTÂNCIA',
    title: 'Conectar Instância',
    methodDisplay: 'GET',
    path: '/instance/connect/{instanceName}',
    description: 'Solicita conexão. Retorna o QRCode base64 caso o robô esteja precisando de leitura.',
    pathParams: [
      { name: 'instanceName', type: 'string', required: true, description: 'Nome da instância a ser conectada.' }
    ],
    bodyParams: [],
    code: `curl -X GET \\
  '${apiUrl.value}/instance/connect/{instanceName}' \\
  -H 'Authorization: Bearer ${apiToken}'`,
    responseColor: 'text-green-400',
    response: `{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
}`
  },
  {
    id: 'grp-create',
    group: 'GRUPOS',
    title: 'Criar Grupo',
    methodDisplay: 'POST',
    path: '/group/create/{instanceName}',
    description: 'Força o número conectado a criar um grupo no WhatsApp com contatos.',
    pathParams: [
      { name: 'instanceName', type: 'string', required: true, description: 'Nome da instância.' }
    ],
    bodyParams: [
      { name: 'subject', type: 'string', required: true, description: 'Qual será o nome do grupo.' },
      { name: 'participants', type: 'array', required: true, description: 'Numerais da lista ["55119...", "55118..."]' }
    ],
    code: `curl -X POST \\
  '${apiUrl.value}/group/create/{instanceName}' \\
  -H 'Authorization: Bearer ${apiToken}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "subject": "Nome do Grupo",
    "participants": ["5511999999999"]
}'`,
    responseColor: 'text-green-400',
    response: `{ "id": "123456789-987@g.us", "status": "criado" }`
  },
  {
    id: 'webhook-events',
    group: 'WEBHOOKS',
    title: 'Recebendo Eventos (Webhooks)',
    methodDisplay: 'WEBHOOK',
    path: ' (Seu Servidor) <- POST',
    description: 'Quando configurado, o VapZap enviará requisições POST para a sua URL com os eventos que acontecem no painel (ex: mensagens recebidas, mudança de status).',
    pathParams: [],
    bodyParams: [
      { name: 'event', type: 'string', required: true, description: 'O nome do evento ocorrido (ex: messages.upsert, connection.update).' },
      { name: 'instance', type: 'string', required: true, description: 'Nome da instância que disparou o evento.' },
      { name: 'data', type: 'object', required: true, description: 'O conteúdo payload exato do evento (ex: os dados da mensagem).' },
      { name: 'agent', type: 'object', required: false, description: 'Dados do Agente IA (nome, objective, process). Habilitado se a opção de modificador de IA estiver ativa no painel.' },
      { name: 'connection', type: 'object', required: false, description: 'Detalhes rápidos da conexão (id, nome e status).' },
      { name: 'user', type: 'object', required: false, description: 'Seu usuário, email e seu apiToken (Ideal para conectar com o n8n facilmente).' }
    ],
    code: `// Exemplo de configuração no n8n (Webhook Node):
// Method: POST
// Path: /webhook/vapzap

// O VapZap fará a seguinte requisição POST 
// (SIMULAÇÃO):
POST /webhook/vapzap HTTP/1.1
Host: sua-url.com
Content-Type: application/json

{
  "event": "messages.upsert",
  "instance": "Atendimento_01",
  "data": { ... }
}`,
    responseNotes: `⚠️ Importante: Seu servidor DEVE retornar um Status 200 OK imediatamente para confirmar o recebimento do webhook.`,
    responseColor: 'text-blue-400',
    response: `// Payload Completo com Modificador "Agente e Conexão" Ativo:
{
  "event": "messages.upsert",
  "instance": "Atendimento_01",
  "data": {
    "messages": [
      {
        "key": { "remoteJid": "5511999@s.whatsapp.net", "fromMe": false },
        "message": { "conversation": "Texto recebido do cliente" }
      }
    ]
  },
  "agent": {
    "name": "Agente de Vendas",
    "objective": "Você é um assistente...",
    "process": "1. Diga olá...",
    "observations": "Seja simpático."
  },
  "connection": {
    "id": "123...456",
    "name": "Atendimento_01",
    "status": "CONNECTED"
  },
  "user": {
    "id": "123xyz...",
    "name": "João",
    "email": "joao@email",
    "apiToken": "seu-token-aqui"
  }
}`
  }
];

// Agrupar navegação
const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
  if (!acc[endpoint.group]) acc[endpoint.group] = [];
  acc[endpoint.group].push(endpoint);
  return acc;
}, {});

const activeEndpointId = ref(endpoints[0].id);

const activeEndpoint = computed(() => {
  return endpoints.find(e => e.id === activeEndpointId.value) || endpoints[0];
});

const getMethodColor = (method) => {
  switch (method) {
    case 'GET': return 'bg-green-100 text-green-700';
    case 'POST': return 'bg-blue-100 text-blue-700';
    case 'PUT': return 'bg-yellow-100 text-yellow-700';
    case 'DELETE': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Código copiado!');
  } catch (err) {
    console.error('Failed to copy', err);
  }
};
</script>

<template>
  <div class="h-screen w-full flex text-gray-800 bg-white shadow-sm overflow-hidden">
    
    <!-- LEFT SIDEBAR -->
    <aside class="w-72 border-r border-gray-200 bg-gray-50 flex flex-col h-full overflow-y-auto hidden md:flex shrink-0">
      
      <div class="p-4 border-b border-gray-200 sticky top-0 bg-gray-50 z-10 flex items-center justify-between">
         <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-whatsapp" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span class="text-sm font-extrabold text-gray-900 tracking-tight">API Reference</span>
            <span class="text-[10px] text-gray-500 font-mono ml-1">v1.0</span>
         </div>
      </div>
      
      <!-- Back Button Row -->
      <div class="p-4 pt-6 border-b border-gray-200 mb-2">
         <button @click="router.push('/dashboard')" class="w-full text-left px-4 py-2 text-sm font-bold bg-white border border-gray-200 shadow-sm rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            <span>Voltar ao Painel</span>
         </button>
      </div>

      <div class="p-2 space-y-6 flex-grow pb-10">
        <template v-for="(items, groupName) in groupedEndpoints" :key="groupName">
          <div>
            <div class="px-4 py-1 text-[11px] font-bold text-gray-400 tracking-widest mb-1 uppercase">{{ groupName }}</div>
            <ul class="space-y-0.5">
              <li v-for="ep in items" :key="ep.id">
                <button 
                  @click="activeEndpointId = ep.id"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-between transition-colors',
                    activeEndpointId === ep.id ? 'bg-whatsapp/10 text-whatsapp-dark font-bold' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
                  ]">
                  <span>{{ ep.title }}</span>
                  <span v-if="ep.methodDisplay" :class="[
                    'text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full',
                    ep.methodDisplay === 'GET' ? 'bg-green-100 text-green-700' : '',
                    ep.methodDisplay === 'POST' ? 'bg-blue-100 text-blue-700' : '',
                    ep.methodDisplay === 'PUT' ? 'bg-yellow-100 text-yellow-700' : '',
                  ]">{{ ep.methodDisplay }}</span>
                </button>
              </li>
            </ul>
          </div>
        </template>
      </div>

    </aside>

    <!-- CONTENT: CENTER -->
    <main class="flex-1 h-full overflow-y-auto flex flex-col lg:flex-row relative">
      
      <!-- Center Document area -->
      <div class="flex-1 max-w-3xl p-8 lg:p-12 pb-24">
         <div class="max-w-prose">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ activeEndpoint.title }}</h1>
            
            <div class="flex items-center gap-3 my-6">
              <span v-if="activeEndpoint.methodDisplay" :class="getMethodColor(activeEndpoint.methodDisplay)" class="text-xs font-bold uppercase py-1 px-2 rounded">{{ activeEndpoint.methodDisplay }}</span>
              <code class="text-gray-800 text-sm font-mono font-medium">{{ apiUrl }}{{ activeEndpoint.path }}</code>
            </div>

            <p class="text-gray-600 mb-8 leading-relaxed">{{ activeEndpoint.description }}</p>

            <div v-if="!userObject.apiToken" class="mb-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200 shadow-sm flex gap-3 items-start">
               <svg class="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
               <div>
                  <strong>Aviso: Credenciais Desatualizadas</strong>
                  <p class="mt-1 opacity-90">Por favor, <button @click="router.push('/login')" class="underline font-bold hover:text-yellow-900">faça logout e login novamente</button> para gerar e visualizar o seu <code>API Token</code>! Essa funcionalidade foi adicionada agora à sua conta.</p>
               </div>
            </div>
            <div v-else-if="activeEndpoint.id === 'visao-geral'" class="mb-8 p-5 bg-whatsapp/5 border border-whatsapp/20 rounded-xl shadow-sm">
               <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-bold text-whatsapp-dark">O seu Token de API (Bearer)</h3>
               </div>
               <div class="flex">
                  <code class="text-sm font-mono text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-l-lg block w-full truncate">{{ apiToken }}</code>
                  <button @click="copyToClipboard(apiToken)" class="bg-whatsapp hover:bg-whatsapp-dark text-white px-4 py-2 rounded-r-lg text-sm font-bold shadow-sm transition-colors">Copiar</button>
               </div>
               <p class="text-xs text-gray-500 mt-3">Utilize esse token para suas integrações no n8n. Nunca compartilhe essa chave com pessoas não autorizadas.</p>
            </div>

            <!-- Path Params -->
            <div v-if="activeEndpoint.pathParams && activeEndpoint.pathParams.length > 0" class="mb-10">
               <h3 class="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6">Path Params</h3>
               <div class="space-y-6">
                  <div v-for="param in activeEndpoint.pathParams" :key="param.name" class="flex flex-col sm:flex-row sm:items-start gap-4">
                     <div class="sm:w-1/3">
                        <span class="text-sm font-mono font-bold text-gray-800">{{ param.name }}</span>
                        <div class="mt-1 flex items-center gap-2">
                           <span class="text-xs text-gray-500">{{ param.type }}</span>
                           <span v-if="param.required" class="text-[10px] uppercase font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">required</span>
                        </div>
                     </div>
                     <div class="sm:w-2/3">
                        <p class="text-sm text-gray-600 leading-relaxed">{{ param.description }}</p>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Body Params -->
            <div v-if="activeEndpoint.bodyParams && activeEndpoint.bodyParams.length > 0" class="mb-10">
               <h3 class="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6">Query/Body Params</h3>
               <div class="space-y-6">
                  <div v-for="param in activeEndpoint.bodyParams" :key="param.name" class="flex flex-col sm:flex-row sm:items-start gap-4 border-b border-gray-50 pb-6 last:border-0">
                     <div class="sm:w-1/3">
                        <span class="text-sm font-mono font-bold text-gray-800">{{ param.name }}</span>
                        <div class="mt-1 flex items-center gap-2">
                           <span class="text-xs text-gray-500">{{ param.type }}</span>
                           <span v-if="param.required" class="text-[10px] uppercase font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">required</span>
                        </div>
                     </div>
                     <div class="sm:w-2/3">
                        <input type="text" disabled placeholder="Valor de Exemplo" class="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded p-2 mb-2 text-gray-400 cursor-not-allowed" />
                        <p class="text-sm text-gray-600 leading-relaxed">{{ param.description }}</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      <!-- Right Code block area -->
      <div class="w-full lg:w-[480px] bg-[#1c1d21] text-gray-300 shrink-0 lg:sticky lg:top-0 lg:h-full lg:overflow-y-auto border-l border-gray-800 shadow-xl z-20">
         <div class="p-6">

             <!-- Headers / Auth -->
             <div class="mb-6 bg-[#25262b] rounded-lg pl-4 pr-3 py-3 flex items-center justify-between border border-[#2c2d33] shadow-inner">
                <span class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Authorization</span>
                <span class="text-xs font-mono text-gray-300">Bearer {{ userObject.apiToken ? apiToken.slice(0,8) + '***' : 'SUA_CHAVE_API' }}</span>
             </div>

             <!-- Request Block -->
             <div class="mb-2 flex items-center justify-between">
                <span class="text-[10px] font-bold tracking-widest text-[#5c5f66] uppercase">Request</span>
             </div>
             
             <div class="bg-black/50 rounded-xl overflow-hidden border border-[#2c2d33] mb-8 relative group">
                 <div class="flex items-center justify-between px-4 py-2.5 bg-[#25262b]/80 border-b border-[#2c2d33]">
                    <span class="text-xs font-mono text-[#a6a7ab]">cURL (Shell)</span>
                    <button @click="copyToClipboard(activeEndpoint.code)" class="text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded transition-colors shadow-sm">Copy It!</button>
                 </div>
                 <pre class="p-4 overflow-x-auto text-[13px] font-mono text-[#c1c2c5] whitespace-pre leading-relaxed">{{ activeEndpoint.code }}</pre>
             </div>

             <!-- Response Block -->
             <div class="mb-2">
                <span class="text-[10px] font-bold tracking-widest text-[#5c5f66] uppercase">Response</span>
             </div>

             <div class="bg-black/50 rounded-xl overflow-hidden border border-[#2c2d33]">
                 <div class="px-4 py-2.5 bg-[#25262b]/80 border-b border-[#2c2d33] flex items-center gap-2">
                    <span class="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    <span class="text-xs font-mono font-bold text-green-400">200 Result</span>
                 </div>
                 <pre :class="['p-4 overflow-x-auto text-[13px] font-mono whitespace-pre leading-relaxed', activeEndpoint.responseColor]">{{ activeEndpoint.response }}</pre>
                 <div v-if="activeEndpoint.responseNotes" class="px-4 py-3 bg-[#1A1B1E] text-xs text-gray-400 border-t border-[#2c2d33] leading-relaxed">{{ activeEndpoint.responseNotes }}</div>
             </div>

         </div>
      </div>

    </main>
  </div>
</template>
