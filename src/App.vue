<template>
  <div :data-bs-theme="themeStore.isDarkMode ? 'dark' : 'light'">
    <div class="container-xl">
      <div class="row main-outline">
        <div class="col-md-12 col-12">
          <div class="p-4">
            <div class="stylish-border-bottom mb-4">
              <div class="row main-outline">
                <div class="fs190 italic main-outline d-flex justify-content-between align-items-center">
                  <router-link class="secondary-color mb-0" title="home" to="/">
                    <img src="@/assets/yemewo.png" alt="Yemewo" width="200" />
                  </router-link><button class="menu-button">
                    <router-link :to="{ name: 'home' }"><i class="secondary-color bi bi-house"></i></router-link>
                  </button>
                  <ThemeToggleButton />
                </div>
              </div>
            </div>
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, computed } from "vue";
import { useThemeStore } from "./stores/theme";
import ThemeToggleButton from "@/components/ThemeToggleButton.vue";

export default defineComponent({
  name: "App",
  components: {
    ThemeToggleButton,
  },
  setup() {
    const themeStore = useThemeStore();

    // Function to apply the theme class to the body
    const applyThemeToBody = () => {
      if (themeStore.isDarkMode) {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
      } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
      }
    };

    onMounted(() => {
      themeStore.initializeTheme();
      applyThemeToBody();
    });

    const themeClass = computed(() => ({
      "dark-theme": themeStore.isDarkMode,
      "light-theme": !themeStore.isDarkMode,
    }));

    // Watch for changes in the theme and apply the appropriate class to the body
    watch(
      () => themeStore.isDarkMode,
      (newVal) => {
        applyThemeToBody();
      }
    );
    return {
      themeStore,
      themeClass,
    };
  },
});
</script>
