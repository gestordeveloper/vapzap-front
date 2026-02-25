<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleLogin = async () => {
  errorMsg.value = '';
  loading.value = true;
  
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email: email.value,
      password: password.value
    });
    
    localStorage.setItem('vapzap_token', response.data.token);
    router.push('/dashboard');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      errorMsg.value = err.response.data.error;
    } else {
      errorMsg.value = 'Ocorreu um erro ao fazer login.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-[calc(100vh-80px-150px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <div class="mx-auto w-12 h-12 bg-whatsapp rounded-xl flex items-center justify-center shadow-lg shadow-whatsapp/30 mb-6">
        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </div>
      <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Acesse sua conta</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin">
        
        <div v-if="errorMsg" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3 text-sm text-red-700">
              <p>{{ errorMsg }}</p>
            </div>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">E-mail</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6 px-3">
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Senha</label>
          <div class="mt-2">
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6 px-3">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="flex w-full justify-center rounded-md bg-whatsapp px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-whatsapp-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp disabled:opacity-50 transition-colors">
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Não tem conta?
        <router-link to="/register" class="font-semibold leading-6 text-whatsapp hover:text-whatsapp-dark">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>
