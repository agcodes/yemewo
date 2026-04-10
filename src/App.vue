<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    theme.global.name.value = savedTheme
    document.documentElement.setAttribute('theme', savedTheme)
  } else {
    isDark.value = false
    theme.global.name.value = 'light'
    document.documentElement.setAttribute('theme', 'light')
  }
})

watch(isDark, (newVal) => {
  const themeName = newVal ? 'dark' : 'light'
  theme.global.name.value = themeName
  localStorage.setItem('theme', themeName)
  document.documentElement.setAttribute('theme', themeName)
})
</script>

<template>
  <v-app>
    <v-app-bar app :elevation="0" class="rounded-bar y-app-bar">
      <v-toolbar-title class="text-h5 font-weight-bold">
        <RouterLink to="/" style="color: inherit; text-decoration: none;">
          yemewo
        </RouterLink>
      </v-toolbar-title>
      <v-btn icon="mdi-home" to="/" variant="text" class="me-2">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" variant="text" class="me-2">
        <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
</style>