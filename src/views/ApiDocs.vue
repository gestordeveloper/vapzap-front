<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const copyToClipboard = async (text, btnId) => {
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById(btnId);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Copiado!';
      btn.classList.add('bg-green-100', 'text-green-800');
      btn.classList.remove('bg-gray-100', 'text-gray-700');
      setTimeout(() => {
         btn.innerHTML = originalText;
         btn.classList.remove('bg-green-100', 'text-green-800');
         btn.classList.add('bg-gray-100', 'text-gray-700');
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy', err);
  }
};

const sendTextCode = `curl -X POST ${import.meta.env.VITE_API_URL}/instance/sendText/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "number": "5511999999999",
  "text": "Olá! Esta é uma mensagem de teste do VapZap."
}'`;

const sendImageCode = `curl -X POST ${import.meta.env.VITE_API_URL}/instance/sendImage/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "number": "5511999999999",
  "url": "https://exemplo.com/imagem.png",
  "caption": "Legenda da imagem (Opcional)"
}'`;

const sendVideoCode = `curl -X POST ${import.meta.env.VITE_API_URL}/instance/sendVideo/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "number": "5511999999999",
  "url": "https://exemplo.com/video.mp4",
  "caption": "Legenda do vídeo (Opcional)"
}'`;

const sendAudioCode = `curl -X POST ${import.meta.env.VITE_API_URL}/instance/sendAudio/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "number": "5511999999999",
  "url": "https://exemplo.com/audio.mp3"
}'`;

const sendDocumentCode = `curl -X POST ${import.meta.env.VITE_API_URL}/instance/sendDocument/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "number": "5511999999999",
  "url": "https://exemplo.com/tabela.pdf",
  "mimetype": "application/pdf",
  "fileName": "Planilha Anual.pdf",
  "caption": "Segue o documento solicitado! (Opcional)"
}'`;

const webhookPayloadCode = `{
  "event": "messages.upsert",
  "instance": "NOME_DA_INSTANCIA",
  "data": {
    "messages": [
      {
        "key": {
          "remoteJid": "5511999999999@s.whatsapp.net",
          "fromMe": false,
          "id": "3EB0FC1..."
        },
        "message": {
          "conversation": "Texto recebido do cliente"
        },
        "messageTimestamp": 1708819200
      }
    ],
    "type": "notify"
  }
}`;

const connectInstanceCode = `curl -X GET ${import.meta.env.VITE_API_URL}/instance/connect/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT"

# Resposta de Sucesso (Se ainda não conectado, retorna o QRCode base64)
# {
#   "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUh..."
# }`;

const groupCreateCode = `curl -X POST ${import.meta.env.VITE_API_URL}/group/create/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "subject": "Vendas 2024 - VIP",
  "participants": [
    "5511999999999",
    "5511888888888"
  ]
}'`;

const groupListCode = `curl -X GET ${import.meta.env.VITE_API_URL}/group/list/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT"

# Resposta de Sucesso (Retorna os IDs e Metadados dos grupos)
# {
#   "groups": [
#     { "id": "1234567890-123456@g.us", "subject": "Vendas 2024 - VIP", ... }
#   ]
# }`;

const groupUpdateSubjectCode = `curl -X PUT ${import.meta.env.VITE_API_URL}/group/updateName/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "groupId": "1234567890-123456@g.us",
  "subject": "Vendas 2025 - VIP (Atualizado)"
}'`;

const groupUpdateDescriptionCode = `curl -X PUT ${import.meta.env.VITE_API_URL}/group/updateDescription/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "groupId": "1234567890-123456@g.us",
  "description": "Regras do grupo: Proibido spam..."
}'`;

const groupActionCode = `curl -X POST ${import.meta.env.VITE_API_URL}/group/addParticipant/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "groupId": "1234567890-123456@g.us",
  "participants": [
    "5511777777777"
  ]
}'
# Nota: Esta mesma estrutura serve para /group/removeParticipant, 
# /group/promoteParticipant e /group/demoteParticipant.`;

const groupLeaveCode = `curl -X POST ${import.meta.env.VITE_API_URL}/group/leave/NOME_DA_INSTANCIA \\
-H "Authorization: Bearer SEU_TOKEN_JWT" \\
-H "Content-Type: application/json" \\
-d '{
  "groupId": "1234567890-123456@g.us"
}'`;

</script>

<template>
  <div class="min-h-screen bg-transparent flex flex-col">

    <main class="flex-grow max-w-5xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      
      <!-- Voltar -->
      <div class="mb-6">
         <button @click="router.push('/dashboard')" class="text-gray-500 hover:text-whatsapp transition-colors flex items-center gap-2 text-sm font-medium">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             <span>Voltar ao Painel</span>
         </button>
      </div>

      <!-- Header Section -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold leading-9 text-gray-900 sm:truncate sm:tracking-tight mb-2">Documentação da API REST</h1>
        <p class="text-base text-gray-500 max-w-2xl text-justify mb-6">Aprenda a integrar o VapZap no seu sistema utilizando os nossos endpoints RESTful. O envio de mensagens e a automação do WhatsApp são feitos através de requisições HTTP seguras com os mesmos padrões de mensageria da Evolution API.</p>

        <!-- Authentication Note -->
        <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl shadow-sm">
           <h3 class="text-blue-900 font-bold text-lg mb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"></path></svg>
              Como funciona a Autenticação?
           </h3>
           <p class="text-blue-800 text-sm mb-3">Para consumir as rotas abaixo, você não usará o ID da Instância na autenticação. Você utilizará um <strong>Token JWT</strong> (o token gerado quando você faz o Login na plataforma). Esse token representa o seu usuário e prova para a API que a instância pertence a você.</p>
           <ul class="list-disc list-inside text-blue-800 text-sm space-y-1 ml-1 mb-4">
              <li>Envie o Token em todas as requisições no cabeçalho <code class="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-mono text-xs">Authorization: Bearer SEU_TOKEN_JWT</code>.</li>
              <li>A diferença entre o <strong>Nome da Instância</strong> e o <strong>ID</strong> é simples: na URL da API, você usará o nome exato que você deu lá no painel (ex: <code class="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-mono text-xs">Atendimento_Suporte</code>), enquanto o ID geralmente serve só para rastreios internos de eventos.</li>
           </ul>
        </div>
      </div>

      <div class="space-y-12">
        
        <!-- Endpoint: Send Text -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-blue-100 text-blue-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Enviar Mensagem de Texto</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Envia uma mensagem de texto simples para qualquer número de WhatsApp utilizando a sua instância conectada.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-send" @click="copyToClipboard(sendTextCode, 'btn-copy-send')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ sendTextCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Send Image -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-blue-100 text-blue-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Enviar Imagem (URL)</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Envia uma imagem fornecida por uma URL pública e legível. O WhatsApp cuidará do download e exibição imediata na conversa.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-image" @click="copyToClipboard(sendImageCode, 'btn-copy-image')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ sendImageCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Send Video -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-blue-100 text-blue-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Enviar Arquivo de Vídeo (URL)</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Manda arquivos mp4. Ideal para demonstrações dinâmicas de software ou envios institucionais com legenda.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-video" @click="copyToClipboard(sendVideoCode, 'btn-copy-video')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ sendVideoCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Send Audio -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-blue-100 text-blue-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Enviar Áudio (Voice Note)</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">A API envia o link do áudio passado simulando uma chamada gravada na hora (Voice Message / PTT), garantindo um atendimento bem mais próximo e humanizado pelo Robô Whatsapp.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-audio" @click="copyToClipboard(sendAudioCode, 'btn-copy-audio')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ sendAudioCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Send Document -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-blue-100 text-blue-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Enviar Documento (URL)</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Manda arquivos genéricos (PDF, Word, Excel, ZIP) a partir de um link da internet para o usuário. Você controla o nome e o tipo mime real do arquivo original na plataforma.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-document" @click="copyToClipboard(sendDocumentCode, 'btn-copy-document')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ sendDocumentCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Send Document -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-blue-100 text-blue-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Enviar Documento (URL)</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Manda arquivos genéricos (PDF, Word, Excel, ZIP) a partir de um link da internet para o usuário. Você controla o nome e o tipo mime real do arquivo original na plataforma.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-document" @click="copyToClipboard(sendDocumentCode, 'btn-copy-document')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ sendDocumentCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Divider for Group APIs -->
        <div class="flex items-center gap-4 py-4">
            <div class="h-px bg-gray-200 flex-grow"></div>
            <span class="text-sm font-bold text-gray-500 uppercase tracking-wider">Gerenciamento de Grupos</span>
            <div class="h-px bg-gray-200 flex-grow"></div>
        </div>

        <!-- Endpoint: List Groups -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-green-100 text-green-700 font-mono text-xs font-bold px-2.5 py-1 rounded">GET</span>
               <h3 class="text-lg font-semibold text-gray-900">Listar Grupos da Instância</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Retorna uma lista com todos os grupos que o seu robô faz parte atualmente. É extremamente útil para capturar os <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">groupId</code> (<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">@g.us</code>) e utilizá-los no disparo de mensagens em grupo.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-list-groups" @click="copyToClipboard(groupListCode, 'btn-copy-list-groups')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ groupListCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Create Group -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-purple-100 text-purple-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Criar Novo Grupo</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Cria um novo grupo no WhatsApp com os participantes informados e retorna o ID do grupo criado (ex: <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">1234567890-123456@g.us</code>) para uso nos demais comandos.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-create-group" @click="copyToClipboard(groupCreateCode, 'btn-copy-create-group')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ groupCreateCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Update Group Info -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-yellow-100 text-yellow-700 font-mono text-xs font-bold px-2.5 py-1 rounded">PUT</span>
               <h3 class="text-lg font-semibold text-gray-900">Alterar Nome e Descrição</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Utilize os endpoints <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">/updateName</code> e <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">/updateDescription</code> passando o <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">groupId</code> para atualizar as informações do grupo.</p>
            <div class="grid grid-cols-1 gap-6">
                <!-- Name -->
                <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
                <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                    <span class="text-xs text-gray-400 font-mono">Alterar Nome (updateName)</span>
                    <button id="btn-copy-update-name" @click="copyToClipboard(groupUpdateSubjectCode, 'btn-copy-update-name')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar</button>
                </div>
                <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">{{ groupUpdateSubjectCode }}</div>
                </div>
                <!-- Description -->
                <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
                <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                    <span class="text-xs text-gray-400 font-mono">Alterar Descrição (updateDescription)</span>
                    <button id="btn-copy-update-desc" @click="copyToClipboard(groupUpdateDescriptionCode, 'btn-copy-update-desc')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar</button>
                </div>
                <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">{{ groupUpdateDescriptionCode }}</div>
                </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Manage Participants -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-purple-100 text-purple-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Gerenciar Participantes e Administradores</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">O mesmo payload (array de números) é utilizado para <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">/addParticipant</code>, <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">/removeParticipant</code>, <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">/promoteParticipant</code> (Dá poder de Admin) e <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">/demoteParticipant</code>.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">Exemplo: Adicionar (addParticipant)</span>
                  <button id="btn-copy-action" @click="copyToClipboard(groupActionCode, 'btn-copy-action')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ groupActionCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Leave Group -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-red-100 text-red-700 font-mono text-xs font-bold px-2.5 py-1 rounded">POST</span>
               <h3 class="text-lg font-semibold text-gray-900">Sair do Grupo</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Comando para a Instância (Robô) sair de um grupo que ela participa.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL / JSON</span>
                  <button id="btn-copy-leave" @click="copyToClipboard(groupLeaveCode, 'btn-copy-leave')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ groupLeaveCode }}
               </div>
            </div>
          </div>
        </section>

        <!-- Endpoint: Connect Instance -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <span class="bg-green-100 text-green-700 font-mono text-xs font-bold px-2.5 py-1 rounded">GET</span>
               <h3 class="text-lg font-semibold text-gray-900">Gerar QR Code / Conectar Instância</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Inicializa a instância no backend. Se ela não estiver conectada ao celular, a API retorna uma string Base64 contendo a imagem do QR Code para ser escaneada.</p>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">cURL</span>
                  <button id="btn-copy-connect" @click="copyToClipboard(connectInstanceCode, 'btn-copy-connect')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ connectInstanceCode }}
               </div>
            </div>
          </div>
        </section>
        
        <!-- Guide: Webhooks -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 border-l-4 border-l-whatsapp flex items-center justify-between">
             <div class="flex items-center gap-3">
               <svg class="w-6 h-6 text-whatsapp" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
               <h3 class="text-lg font-semibold text-gray-900">Recebendo Webhooks</h3>
             </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Quando você configura uma URL de webhook na sua instância, o VapZap irá disparar requisições <code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">POST</code> para a sua URL em tempo real sempre que ocorrer um evento no WhatsApp, como uma nova mensagem recebida ou mudança de bateria.</p>
            
            <h4 class="text-sm font-semibold text-gray-900 mt-6 mb-3">Payload de Exemplo (Nova Mensagem Recebida):</h4>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
               <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span class="text-xs text-gray-400 font-mono">JSON</span>
                  <button id="btn-copy-webhook" @click="copyToClipboard(webhookPayloadCode, 'btn-copy-webhook')" class="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all">Copiar Código</button>
               </div>
               <div class="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
{{ webhookPayloadCode }}
               </div>
            </div>
            
            <div class="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
               <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div>
                    <h5 class="text-sm font-semibold text-yellow-800">Atenção ao responder Webhooks</h5>
                    <p class="text-xs text-yellow-700 mt-1">O seu servidor deve sempre retornar um Status Code <code class="font-mono">200 OK</code> o mais rápido possível ao receber a requisição. Caso contrário, o VapZap pode achar que sua URL está offline e acumular os eventos.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>
