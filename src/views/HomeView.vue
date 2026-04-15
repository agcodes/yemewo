<template>
  <div>
    <p class="mb-6 mt-6 fs130">A vous de jouer</p>
    <ul class="list-group expressive-menu fs120">
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'guess-word-letters' }"><i
            class="expressive-menu-item-bi bi bi-alphabet-uppercase"></i> Jeu du
          pendu</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'anagram' }"><i class="expressive-menu-item-bi bi bi-shuffle"></i> Trouver
          l'anagramme</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'guess-word' }"><i class="expressive-menu-item-bi bi bi-question-lg"></i> Deviner le
          mot</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'flags-quiz' }"><i class="expressive-menu-item-bi bi bi-flag mr-5"></i> Trouver le
          drapeau</router-link>
      </li>
      <li class="expressive-menu-item mb-1">
        <router-link :to="{ name: 'guess-wiki-words' }"><i class="expressive-menu-item-bi bi bi-wikipedia mr-5"></i>
          Deviner les
          articles Wikipédia</router-link>
      </li>

    </ul>
  </div>
</template>