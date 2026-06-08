<template>
  <div :data-bs-theme="themeStore.isDarkMode ? 'dark' : 'light'">
    <div class="container-xl">
      <div class="row main-outline">
        <div class="col-md-12 col-12">
          <div class="p-2">
            <div class="stylish-border-bottom mb-4 pb-2 pt-2">
              <div class="row main-outline">
                <div class=" main-outline d-flex justify-content-between ">
                  <div class="d-flex align-middle">
                    <router-link class=" font-titilliumWeb-regular secondary-color fs-3 me-4 " title="Yemewo Home" to="/">
                      yemewo
                    </router-link>
                    <button class="me-4 menu-button secondary-color">
                      <router-link :to="{ name: 'home' }"><i class="bi bi-house"></i></router-link>
                    </button>
                  </div>
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
