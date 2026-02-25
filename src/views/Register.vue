<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleRegister = async () => {
  errorMsg.value = '';
  
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'As senhas não coincidem.';
    return;
  }
  
  loading.value = true;
  
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    // Auto login after successful registration
    const loginResponse = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email: email.value,
      password: password.value
    });
    
    localStorage.setItem('vapzap_token', loginResponse.data.token);
    router.push('/dashboard');
    
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      errorMsg.value = err.response.data.error;
    } else {
      errorMsg.value = 'Ocorreu um erro ao criar a conta.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-[calc(100vh-80px-150px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <img src="/logo.svg" alt="VapZap Logo" class="mx-auto h-16 w-auto mb-6" />
      <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Crie sua conta</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleRegister">
        
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
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Nome completo</label>
          <div class="mt-2">
            <input v-model="name" id="name" name="name" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6 px-3">
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
            <input v-model="password" id="password" name="password" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6 px-3">
          </div>
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">Confirmar Senha</label>
          <div class="mt-2">
            <input v-model="confirmPassword" id="confirmPassword" name="confirmPassword" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-whatsapp sm:text-sm sm:leading-6 px-3">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="flex w-full justify-center rounded-md bg-whatsapp px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-whatsapp-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp disabled:opacity-50 transition-colors">
            <span v-if="loading">Criando conta...</span>
            <span v-else>Criar conta</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Já tem conta?
        <router-link to="/login" class="font-semibold leading-6 text-whatsapp hover:text-whatsapp-dark">Faça login</router-link>
      </p>
    </div>
  </div>
</template>
