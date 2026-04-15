<template>
  <button @click="toggleTheme" class="menu-button">
    <i title="light mode" v-if="isDarkMode" class="bi bi-sun-fill"></i>
    <i title="dark mode" v-else class="bi bi-moon-stars-fill"></i>
  </button>
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
