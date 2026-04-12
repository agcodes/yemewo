// stores/theme.ts
import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDarkMode: false as boolean,
  }),
  actions: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
    },
    initializeTheme() {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        this.isDarkMode = savedTheme === "dark";
      } else {
        this.isDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      }
    },
  },
});
