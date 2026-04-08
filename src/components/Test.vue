
<template>
    <!-- Top App Bar -->
  
      <v-container class="max-w-screen-xl mx-auto">
        <v-row>
          <!-- Left Column: Game Area -->
          <v-col cols="12" md="8">
            <div class="mb-8">
              <v-chip color="amber-darken-2" size="small" class="font-bold mb-4" prepend-icon="mdi-star">
                NOUVEAU DÉFI
              </v-chip>
              <h1 class="text-h2 font-weight-black text-indigo-900 mb-2">Trouver le bon drapeau</h1>
              <p class="text-subtitle-1 text-slate-500">Testez vos connaissances géographiques mondiales</p>
            </div>

            <v-card class="rounded-[2.5rem] pa-12 border-none shadow-xl bg-white">
              <div class="mb-10">
                <p class="text-uppercase text-caption font-weight-bold text-slate-400 tracking-widest mb-2">
                  IDENTIFIEZ LE DRAPEAU DE :
                </p>
                <h2 class="text-h2 font-weight-black text-slate-800">Île Bouvet</h2>
              </div>

              <v-row>
                <v-col v-for="option in options" :key="option.id" cols="12" sm="6">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      variant="tonal"
                      class="rounded-pill pa-4 d-flex align-center border-2"
                      :color="option.selected ? 'indigo' : 'slate-100'"
                      :elevation="isHovering ? 4 : 0"
                      @click="selectOption(option.id)"
                    >
                      <v-img
                        :src="option.img"
                        width="80"
                        height="50"
                        cover
                        class="rounded-lg mr-4"
                      ></v-img>
                      <span class="font-weight-bold text-indigo-900">{{ option.label }}</span>
                      <v-spacer></v-spacer>
                      <v-icon
                        :icon="option.selected ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
                        :color="option.selected ? 'indigo-600' : 'slate-300'"
                      ></v-icon>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>

              <v-alert
                class="mt-12 rounded-pill bg-indigo-50 border-none text-indigo-700"
                icon="mdi-lightbulb"
                density="comfortable"
              >
                Devinez le pays à partir de son drapeau ! Plus vous répondez vite, plus vous gagnez de points.
              </v-alert>
            </v-card>
          </v-col>

          <!-- Right Column: Sidebar Stats -->
          <v-col cols="12" md="4">
            <!-- Progression -->
            <div class="mb-10 px-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-uppercase text-caption font-weight-bold text-indigo-900 tracking-widest">PROGRESSION</span>
                <span class="text-caption font-weight-black text-indigo-700">65%</span>
              </div>
              <v-progress-linear
                model-value="65"
                height="10"
                rounded
                color="amber-lighten-1"
                bg-color="slate-200"
                bg-opacity="1"
              ></v-progress-linear>
            </div>

            <!-- Current Score Card -->
            <v-card class="rounded-[2.5rem] pa-8 mb-8 text-center bg-indigo-600 text-white elevation-12">
              <p class="text-uppercase text-caption font-weight-bold mb-4 opacity-80 tracking-widest">
                VOTRE SCORE ACTUEL
              </p>
              <div class="d-flex align-baseline justify-center mb-8">
                <span class="text-h1 font-weight-black">1240</span>
                <span class="ml-2 font-weight-bold opacity-70">pts</span>
              </div>
              <v-btn
                block
                size="x-large"
                color="amber-lighten-1"
                class="rounded-pill font-weight-black text-indigo-900 h-16 text-lg"
                elevation="8"
              >
                VALIDER MA RÉPONSE
              </v-btn>
            </v-card>

            <!-- Quest History -->
            <v-card class="rounded-[2.5rem] pa-8 bg-white border-none shadow-lg">
              <div class="d-flex justify-space-between align-center mb-6">
                <h3 class="text-h6 font-weight-black text-indigo-900">Dernières Quêtes</h3>
                <v-icon color="slate-400">mdi-history</v-icon>
              </div>

              <v-list bg-color="transparent" class="pa-0">
                <v-list-item
                  v-for="quest in history"
                  :key="quest.country"
                  class="px-0 mb-4"
                >
                  <template v-slot:prepend>
                    <v-avatar size="48" class="mr-4">
                      <v-img :src="quest.flag"></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-black text-slate-800">{{ quest.country }}</v-list-item-title>
                  <v-list-item-subtitle class="text-uppercase text-[10px] font-weight-bold mt-1">
                    <span :class="quest.success ? 'text-green-600' : 'text-red-600'">
                      {{ quest.success ? 'RÉUSSITE' : 'ÉCHEC' }}
                    </span>
                    <span class="text-slate-400 ml-1">• {{ quest.points }} PTS</span>
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-icon :color="quest.success ? 'green-600' : 'red-600'" size="small">
                      {{ quest.success ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                  </template>
                </v-list-item>
              </v-list>

              <v-btn
                variant="outlined"
                block
                class="rounded-pill mt-4 border-indigo-100 text-indigo-600 font-bold"
                height="50"
              >
                Voir tout l'historique
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>

<script setup>
import { ref } from 'vue'

const options = ref([
  { id: 'A', label: 'Option A', img: 'https://placehold.co/80x50/1e293b/white?text=A', selected: false },
  { id: 'B', label: 'Option B', img: 'https://placehold.co/80x50/1e293b/white?text=B', selected: false },
  { id: 'C', label: 'Option C', img: 'https://placehold.co/80x50/1e293b/white?text=C', selected: false },
  { id: 'D', label: 'Option D', img: 'https://placehold.co/80x50/1e293b/white?text=D', selected: false }
])

const history = ref([
  { country: 'France', flag: 'https://placehold.co/48x48/e11d48/white?text=FR', success: true, points: '+120' },
  { country: 'Japon', flag: 'https://placehold.co/48x48/fb7185/white?text=JP', success: true, points: '+150' },
  { country: 'Brésil', flag: 'https://placehold.co/48x48/fbbf24/white?text=BR', success: false, points: '0' }
])

const selectOption = (id) => {
  options.value.forEach(opt => {
    opt.selected = opt.id === id
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.v-application {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}

.text-h2 {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  letter-spacing: -0.02em !important;
}

.shadow-xl {
  box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.1) !important;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
}
</style>