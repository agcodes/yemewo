<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar app :elevation="0" class="rounded-bar" style="
        
       background: linear-gradient(135deg, hsl(240, 80%, 80%), hsl(240, 60%, 85%));
        color: #070708;
        text-decoration: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      "><v-toolbar-title class="text-h5 font-weight-bold">
        <RouterLink to="/" style="color: inherit; text-decoration: none;">
          yemewo
        </RouterLink>
      </v-toolbar-title>
      <v-btn icon="mdi-home" to="/" variant="text" class="me-2">
        <v-icon>mdi-home</v-icon>
      </v-btn>

    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
/* Optionnel : Pour un texte plus lisible sur fond transparent */
.v-toolbar__title {
  color: rgb(var(--v-theme-on-background));
  /* Couleur dynamique selon le thème */
}
</style>