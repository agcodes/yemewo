<template>
  <div>
    <p class="mb-6 mt-6 fs130">A vous de jouer</p>
    <ul class="list-group expressive-menu fs120">
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'guess-word-letters' }"> Jeu du
          pendu</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'anagram' }"> Trouver
          l'anagramme</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'guess-word' }"> Deviner le
          mot</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'flags-quiz' }"> Trouver le
          drapeau</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'guess-wiki-words' }">Deviner les
          articles Wikipédia</router-link>
      </li>

    </ul>
  </div>
</template>