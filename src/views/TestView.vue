<template>
 

  <v-main class="bg-grey-lighten-4">
    <v-container fluid class="pa-8">
      <v-row>
        <!-- Main Quiz Area -->
        <v-col cols="12" md="8">
          <v-card flat rounded="xl" class="pa-10 fill-height">
          
            <h1 class="text-h3 font-weight-bold mb-2">Jeu des drapeaux</h1>
            <div class="text-h2 font-weight-black primary-text mb-2">Zimbabwe</div>
            <p class="text-body-1 grey--text text--darken-1">Identify the correct flag for this nation</p>

            <v-row class="mt-8">
              <v-col v-for="(option, index) in options" :key="index" cols="12" sm="6">
                <v-card
                  outlined
                  rounded="0"
                  :class="['pa-4 option-card', { 'selected-card': selectedOption === index }]"
                  @click="selectedOption = index"
                >
                  <v-img :src="option.flag" height="150" contain class="rounded mb-4 bg-grey-lighten-3"></v-img>
                  <div class="d-flex align-center justify-space-between">
                    <span class="font-weight-bold">Option {{ String.fromCharCode(65 + index) }}</span>
                    <v-radio-group v-model="selectedOption" hide-details class="ma-0 pa-0">
                      <v-radio :value="index" color="primary"></v-radio>
                    </v-radio-group>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-8"></v-divider>

            <div class="d-flex gap-4">
              <v-btn x-large rounded flat color="cyan lighten-4" class="text-none flex-grow-1 px-8 py-6 font-weight-bold">
                Skip Round
              </v-btn>
              <v-btn x-large rounded flat color="primary" class="text-none flex-grow-1 px-8 py-6 font-weight-bold elevation-4">
                Validate Answer
              </v-btn>
            </div>
          </v-card>
        </v-col>

        <!-- Sidebar Stats -->
        <v-col cols="12" md="4">
          <v-card flat rounded="xl" color="#f1efff" class="pa-8 mb-6">
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="mr-2">mdi-star</v-icon>
              <span class="font-weight-bold text-h6">Your Session</span>
            </div>
            <div class="text-center py-6">
              <div class="text-h1 font-weight-black mb-2">0 / 0</div>
              <p class="grey--text">Perfect Accuracy streak</p>
            </div>
            <v-progress-linear value="0" color="primary" rounded height="8"></v-progress-linear>
          </v-card>

          <v-card flat rounded="xl" class="pa-8">
            <div class="d-flex justify-space-between align-center mb-6">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-history</v-icon>
                <span class="font-weight-bold text-h6">Historique</span>
              </div>
              <v-btn text x-small color="error" class="font-weight-bold">TOUT EFFACER</v-btn>
            </div>

            <v-list v-if="history.length > 0" flat>
              <v-list-item v-for="(item, i) in history" :key="i" class="history-item mb-2 rounded-lg" :style="{ borderLeft: '4px solid #0061FF' }">
                <v-list-item-avatar rounded size="48">
                  <v-img :src="item.flag"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{ item.country }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.time }} • TODAY</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon color="success" small>mdi-check-circle</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <div v-else class="text-center py-10">
              <v-icon size="64" color="grey lighten-1">mdi-tray-remove</v-icon>
              <p class="grey--text mt-4">End of session records</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
name: 'FlagQuiz',
data: () => ({
  selectedOption: null,
  options: [
    { flag: 'https://flagcdn.com/w320/it.png', name: 'Italy' },
    { flag: 'https://flagcdn.com/w320/ae.png', name: 'UAE' },
    { flag: 'https://flagcdn.com/w320/zw.png', name: 'Zimbabwe' },
    { flag: 'https://flagcdn.com/w320/st.png', name: 'Sao Tome and Principe' }
  ],
  history: [
    { country: 'Tunisie', flag: 'https://flagcdn.com/w320/tn.png', time: '14:32' },
    { country: 'France', flag: 'https://flagcdn.com/w320/fr.png', time: '14:15' }
  ]
}),
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.primary-text {
color: #0061FF;
}

.option-card {
cursor: pointer;
transition: all 0.3s ease;
border: 2px solid transparent !important;
}

.option-card:hover {
background-color: #f8f5ff;
}

.selected-card {
border-color: #0061FF !important;
background-color: #f1efff !important;
}

.history-item {
background-color: #f8f9fa;
}

.gap-4 {
gap: 16px;
}
</style>