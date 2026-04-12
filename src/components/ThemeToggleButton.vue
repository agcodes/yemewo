<template>

  <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" variant="text" class="me-2">
      <v-icon>{{ isDarkMode ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useThemeStore } from "@/stores/theme"

export default defineComponent({
  name: "ThemeToggleButton",
  setup() {
    const themeStore = useThemeStore();

    const isDarkMode = computed(() => themeStore.isDarkMode);

    const toggleTheme = () => {
      themeStore.toggleTheme();
    };

    return {
      isDarkMode,
      toggleTheme,
    };
  },
});
</script>
