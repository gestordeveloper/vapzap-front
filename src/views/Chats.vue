<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const instances = ref([]);
const activeInstanceName = ref(route.params.name || 'Todos');

const chats = ref([]);
const activeChat = ref(null);
const messages = ref([]);
const loadingChats = ref(true);
const loadingMessages = ref(false);
const messageText = ref('');
const fileInput = ref(null);
const sendingMessage = ref(false);
const messagesContainer = ref(null);
let pollingInterval = null;

const fetchInstances = async () => {
  try {
    const token = localStorage.getItem('vapzap_token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/instance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    instances.value = response.data;
    
    // Auto-select first connected instance if none selected
    if (activeInstanceName.value === null && instances.value.length > 0) {
       activeInstanceName.value = 'Todos';
    }
  } catch (err) {
    console.error('Failed to fetch instances', err);
  }
};

const fetchChats = async () => {
  if (!activeInstanceName.value) return;
  // loadingChats.value = true; // Removed loader per user request
  try {
    const token = localStorage.getItem('vapzap_token');
    let url = `${import.meta.env.VITE_API_URL}/chat/${activeInstanceName.value}`;
    if (activeInstanceName.value === 'Todos') {
       url = `${import.meta.env.VITE_API_URL}/chat`;
    }
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    chats.value = response.data.chats;
  } catch (err) {
    console.error('Failed to fetch chats', err);
  } finally {
    loadingChats.value = false;
  }
};

const changeInstance = async (name) => {
  activeInstanceName.value = name;
  activeChat.value = null;
  messages.value = [];
  chats.value = [];
  await fetchChats();
};

const selectChat = async (chat) => {
  activeChat.value = chat;
  await fetchMessages();
  scrollToBottom();
};

const fetchMessages = async () => {
  if (!activeChat.value) return;
  
  // Need to get the actual instance name of the chat if we are in "Todos" view
  let chatInstanceName = activeInstanceName.value;
  if (chatInstanceName === 'Todos') {
    chatInstanceName = activeChat.value.instance?.name;
    if (!chatInstanceName) return;
  }

  try {
    const token = localStorage.getItem('vapzap_token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/${chatInstanceName}/${activeChat.value.remoteJid}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const oldLength = messages.value.length;
    messages.value = response.data.messages;
    
    if (messages.value.length > oldLength) {
       scrollToBottom();
    }
  } catch (err) {
    console.error('Failed to fetch messages', err);
  }
};

const startPolling = () => {
  pollingInterval = setInterval(() => {
    fetchInstances();
    if (activeInstanceName.value) {
      fetchChats();
      if (activeChat.value) {
        fetchMessages();
      }
    }
  }, 5000);
};

const getMediaUrl = (msg) => {
  if (!msg.mediaUrl) return '';
  const token = localStorage.getItem('vapzap_token');
  const fileName = msg.mediaUrl.split('/').pop();
  
  let instanceName = activeInstanceName.value;
  if (instanceName === 'Todos') {
    instanceName = activeChat.value?.instance?.name || msg.mediaUrl.split('/')[1]; 
  }
  
  if (!instanceName) return '';
  return `${import.meta.env.VITE_API_URL}/chat/media/${instanceName}/${fileName}`;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!messageText.value.trim() && (!fileInput.value || !fileInput.value.files[0])) return;
  if (!activeChat.value) return;

  sendingMessage.value = true;
  const token = localStorage.getItem('vapzap_token');
  
  const formData = new FormData();
  formData.append('number', activeChat.value.remoteJid);
  
  if (messageText.value.trim()) {
    formData.append('text', messageText.value.trim());
  }
  
  if (fileInput.value && fileInput.value.files[0]) {
    formData.append('file', fileInput.value.files[0]);
  }

  try {
    let chatInstanceName = activeInstanceName.value;
    if (chatInstanceName === 'Todos') {
      chatInstanceName = activeChat.value.instance?.name;
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/chat/${chatInstanceName}/send`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    });
    
    messageText.value = '';
    if (fileInput.value) fileInput.value.value = '';
    
    await fetchMessages();
    scrollToBottom();
  } catch (err) {
    console.error('Failed to send message', err);
    alert('Erro ao enviar mensagem.');
  } finally {
    sendingMessage.value = false;
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  await fetchInstances();
  if (activeInstanceName.value) {
     await fetchChats();
  }
  startPolling();
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<template>
  <div class="h-full bg-gray-50 flex flex-col md:flex-row overflow-hidden border-t border-gray-200">
    
    <!-- Sidebar / Chats List -->
    <div class="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col h-full">
      <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-3">
        <h2 class="text-lg font-bold text-gray-800">Conversas</h2>
        
        <!-- Instance Selector -->
        <div class="relative">
          <select 
            v-model="activeInstanceName" 
            @change="changeInstance($event.target.value)"
            class="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-whatsapp focus:border-whatsapp sm:text-sm rounded-lg shadow-sm font-medium text-gray-700 bg-white"
          >
            <option value="Todos">Todas Instâncias</option>
            <option v-for="inst in instances" :key="inst.id" :value="inst.name">
              {{ inst.name }} {{ inst.status === 'CONNECTED' ? '🟢' : '🔴' }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="flex-grow overflow-y-auto w-full">
        <!-- Removed loading block per request -->
        <div v-if="chats.length === 0" class="text-center py-10 text-gray-400">
           Nenhuma conversa encontrada.
        </div>
        
        <div v-for="chat in chats" :key="chat.id" 
             @click="selectChat(chat)"
             :class="['p-4 border-b border-gray-50 cursor-pointer hover:bg-green-50/50 transition-colors', activeChat?.id === chat.id ? 'bg-green-50 border-l-4 border-l-whatsapp' : '']">
          
          <div class="flex items-center gap-3">
             <!-- Profile Picture -->
             <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
               <img v-if="chat.profilePicUrl" :src="chat.profilePicUrl" alt="Profile" class="w-full h-full object-cover" />
               <div v-else class="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-green-100">
                  {{ chat.name ? chat.name.charAt(0).toUpperCase() : '#' }}
               </div>
             </div>
             
             <!-- Chat Info -->
             <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-0.5">
                  <h3 class="font-semibold text-gray-800 truncate pr-2">{{ chat.name || chat.remoteJid.split('@')[0] }}</h3>
                  <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatTime(chat.lastMessageAt) }}</span>
                </div>
                
                <div class="flex justify-between items-center w-full">
                   <p class="text-sm text-gray-500 truncate" style="max-width: 80%;">
                      <span v-if="chat.messages?.[0]?.type === 'image'">📷 Imagem</span>
                      <span v-else-if="chat.messages?.[0]?.type === 'audio'">🎵 Áudio</span>
                      <span v-else-if="chat.messages?.[0]?.type === 'video'">🎥 Vídeo</span>
                      <span v-else-if="chat.messages?.[0]?.type === 'document'">📄 Documento</span>
                      <span v-else-if="chat.messages?.[0]?.type === 'sticker'">🎃 Sticker</span>
                      <span v-else>{{ chat.messages?.[0]?.text || 'Sem mensagens' }}</span>
                   </p>
                   <span v-if="chat.unreadCount > 0" class="bg-whatsapp text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{{ chat.unreadCount }}</span>
                </div>

                <div v-if="activeInstanceName === 'Todos'" class="mt-1">
                   <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 truncate max-w-full">
                     {{ chat.instance?.name || 'VapZap' }}
                   </span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Chat Area -->
    <div class="w-full md:w-2/3 lg:w-3/4 flex flex-col h-full bg-[#f0f2f5] overflow-hidden">
      
      <template v-if="activeChat">
        <!-- Chat Header -->
        <div class="p-4 bg-white border-b border-gray-200 flex items-center shadow-sm z-10 sticky top-0">
           <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold mr-3 flex-shrink-0 overflow-hidden">
              <img v-if="activeChat.profilePicUrl" :src="activeChat.profilePicUrl" alt="Profile" class="w-full h-full object-cover" />
              <div v-else>{{ activeChat.name ? activeChat.name.charAt(0).toUpperCase() : '#' }}</div>
           </div>
           <div class="min-w-0">
              <h3 class="font-bold text-gray-800 truncate">{{ activeChat.name || activeChat.remoteJid.split('@')[0] }}</h3>
              <p class="text-xs text-gray-500 truncate">{{ activeChat.remoteJid.split('@')[0] }}</p>
           </div>
        </div>
        
        <!-- Messages Area -->
        <div class="flex-grow overflow-y-auto p-4 space-y-4 bg-[#efeae2]/40" ref="messagesContainer">
           <div v-for="msg in messages" :key="msg.id" :class="['flex', msg.fromMe ? 'justify-end' : 'justify-start']">
              
              <!-- Profile Pic for incoming Group Messages -->
              <div v-if="!msg.fromMe && activeChat.remoteJid.includes('@g.us')" class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0 mr-2 mt-1 hidden md:block">
                 <img v-if="msg.participantThumb" :src="msg.participantThumb" alt="Participant" class="w-full h-full object-cover" />
                 <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-500 font-bold bg-green-100">
                    {{ msg.participantName ? msg.participantName.charAt(0).toUpperCase() : '#' }}
                 </div>
              </div>

              <div :class="['max-w-[85%] md:max-w-[70%] rounded-xl px-4 py-2 shadow-sm relative', msg.fromMe ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none']">
                 
                 <!-- Sender Name for incoming Group Messages -->
                 <div v-if="!msg.fromMe && activeChat.remoteJid.includes('@g.us')" class="text-xs font-bold text-[#1f8753] mb-1">
                    {{ msg.participantName || msg.participant?.split('@')[0] || 'Desconhecido' }}
                 </div>

                 <!-- Media rendering based on type -->
                 <div v-if="msg.type === 'image' && msg.mediaUrl" class="mb-2 -mx-4 -mt-2 rounded-t-xl overflow-hidden cursor-pointer">
                    <img :src="getMediaUrl(msg)" class="max-w-full max-h-80 object-cover mx-auto mx-w-[300px] w-full" alt="Imagem enviada" />
                 </div>
                 
                 <div v-else-if="msg.type === 'video' && msg.mediaUrl" class="mb-2 -mx-4 -mt-2 rounded-t-xl overflow-hidden">
                    <video :src="getMediaUrl(msg)" controls class="max-w-full max-h-80 mx-auto bg-black w-full"></video>
                 </div>
                 
                 <div v-else-if="msg.type === 'audio' && msg.mediaUrl" class="mb-2 pt-2">
                    <audio :src="getMediaUrl(msg)" controls class="w-full max-w-[250px] sm:max-w-[300px]"></audio>
                 </div>

                 <div v-else-if="msg.type === 'sticker' && msg.mediaUrl" class="mb-2">
                    <img :src="getMediaUrl(msg)" class="max-w-32 max-h-32 object-contain" alt="Sticker" />
                 </div>
                 
                 <div v-else-if="msg.type === 'document' && msg.mediaUrl" class="mb-2 p-3 bg-white/50 border border-black/10 rounded-lg flex items-center gap-3">
                    <svg class="w-8 h-8 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    <a :href="getMediaUrl(msg)" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium truncate max-w-[200px] break-all block" style="white-space: break-spaces;">{{ msg.text || 'Baixar Arquivo' }}</a>
                 </div>

                 <p v-if="msg.text && msg.type !== 'document'" style="white-space: break-spaces;" class="text-sm leading-relaxed break-words max-w-full table-layout-fixed w-full">{{ msg.text }}</p>
                 
                 <div class="flex items-center justify-end mt-1 space-x-1">
                    <span class="text-[10px] text-gray-500">{{ formatTime(msg.timestamp) }}</span>
                    <span v-if="msg.fromMe">
                       <!-- Check marks based on status -->
                       <svg v-if="msg.status === 'PENDING' || msg.status === 'SENT'" class="w-4 h-4 text-gray-400 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                       <svg v-if="msg.status === 'DELIVERED'" class="w-4 h-4 text-gray-500 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7M5 13l4 4L19 7"></path></svg>
                       <svg v-if="msg.status === 'READ'" class="w-4 h-4 text-blue-500 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7M5 13l4 4L19 7"></path></svg>
                    </span>
                 </div>
              </div>
           </div>
        </div>
        
        <!-- Message Input -->
        <div class="p-3 bg-[#f0f2f5] border-t border-gray-300">
           <form @submit.prevent="sendMessage" class="flex items-end gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-100 relative">
              
              <button type="button" @click="triggerFileInput" class="p-2 text-gray-500 hover:text-whatsapp hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0" title="Anexar arquivo">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              </button>
              
              <input type="file" ref="fileInput" class="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
              
              <div class="flex-grow flex flex-col justify-end w-full min-w-0">
                 <div v-if="fileInput?.files?.length > 0" class="text-xs text-whatsapp font-medium pb-1 px-1 flex items-center justify-between">
                    <span class="truncate pr-2">Anexo: {{ fileInput.files[0].name }}</span>
                    <button type="button" @click="fileInput.value = ''" class="text-red-500 hover:text-red-700 transition-colors">X</button>
                 </div>
                 <textarea 
                    v-model="messageText" 
                    @keydown.enter.exact.prevent="sendMessage"
                    placeholder="Digite uma mensagem..." 
                    class="w-full bg-transparent border-0 focus:ring-0 resize-none max-h-32 min-h-[44px] text-sm py-3 px-2 focus:outline-none"
                    rows="1"
                 ></textarea>
              </div>
              
              <button type="submit" :disabled="sendingMessage || (!messageText.trim() && !fileInput?.files?.length)" class="p-2.5 bg-whatsapp text-white rounded-lg hover:bg-whatsapp-dark disabled:opacity-50 transition-colors flex items-center justify-center flex-shrink-0">
                 <svg v-if="sendingMessage" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 <svg v-else class="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
           </form>
        </div>
      </template>
      
      <div v-else class="flex-grow flex flex-col items-center justify-center text-gray-500 p-8 text-center bg-[#f0f2f5]">
         <div class="w-24 h-24 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center">
           <svg class="w-12 h-12 text-whatsapp opacity-50 relative ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
         </div>
         <h2 class="text-2xl font-medium text-gray-700">VapZap Web</h2>
         <p class="mt-3 text-sm text-gray-500 max-w-sm">Selecione uma conversa ao lado para começar a enviar e receber mensagens deste número.</p>
      </div>

    </div>
  </div>
</template>
