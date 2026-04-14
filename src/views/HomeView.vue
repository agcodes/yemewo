<template>
  <div>
    <p class="mb-6 mt-6">A vous de jouer</p>
    <ul class="list-group expressive-menu fs120">
      <li class="expressive-menu-item mb-5">
        <router-link :to="{ name: 'guess-word-letters' }"><v-icon class="mr-2">mdi-alphabetical-variant</v-icon> Jeu du
          pendu</router-link>
      </li>
      <li class="expressive-menu-item mb-5">
        <router-link :to="{ name: 'anagram' }"><v-icon class="mr-2">mdi mdi-swap-horizontal</v-icon> Trouver
          l'anagramme</router-link>
      </li>
      <li class="expressive-menu-item mb-5">
        <router-link :to="{ name: 'guess-word' }"><v-icon class="mr-2">mdi-alphabetical-variant</v-icon> Deviner le
          mot</router-link>
      </li>
      <li class="expressive-menu-item mb-5">
        <router-link :to="{ name: 'flags-quiz' }"><v-icon class="mr-2">mdi-flag</v-icon> Trouver le
          drapeau</router-link>
      </li>
      <li class="expressive-menu-item mb-5">
        <router-link :to="{ name: 'guess-wiki-words' }"><v-icon class="mr-2">mdi-wikipedia</v-icon> Deviner les
          articles Wikipédia</router-link>
      </li>

    </ul>
  </div>
</template>