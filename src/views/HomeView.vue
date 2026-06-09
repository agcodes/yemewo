<template>
  <div class="container mt-4 p-2">
    <h2 class="mb-4 fs140">À vous de jouer</h2>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mb-5">
      <div class="col expressive-menu-item">
        <router-link :to="{ name: 'guess-word-letters' }" class="text-decoration-none">
          <div class="card bg-transparent border-0 h-100 ">
            <div class="text-center p-5">
              <i class="bi bi-alphabet-uppercase fs-1 secondary-color"></i>
              <h5 class="card-title mt-3 mb-0">Jeu du pendu</h5>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col expressive-menu-item">
        <router-link :to="{ name: 'anagram' }" class="text-decoration-none">
          <div class="card bg-transparent border-0 h-100 ">
            <div class="text-center p-5">
              <i class="bi bi-shuffle fs-1 secondary-color"></i>
              <h5 class="card-title mt-3 mb-0">Trouver l'anagramme</h5>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col expressive-menu-item">
        <router-link :to="{ name: 'guess-word' }" class="text-decoration-none">
          <div class="card bg-transparent border-0 h-100 ">
            <div class="text-center p-5">
              <i class="bi bi-question-lg fs-1 secondary-color"></i>
              <h5 class="card-title mt-3 mb-0">Deviner le mot</h5>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col expressive-menu-item">
        <router-link :to="{ name: 'flags-quiz' }" class="text-decoration-none">
          <div class="card bg-transparent border-0 h-100 ">
            <div class="text-center p-5">
              <i class="bi bi-flag fs-1 secondary-color"></i>
              <h5 class="card-title mt-3 mb-0">Trouver le drapeau</h5>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col expressive-menu-item">
        <router-link :to="{ name: 'guess-wiki-words' }" class="text-decoration-none">
          <div class="card bg-transparent border-0 h-100 ">
            <div class="text-center p-5">
              <i class="bi bi-wikipedia fs-1 secondary-color"></i>
              <h5 class="card-title mt-3 mb-0">Deviner l'article Wikipédia</h5>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col expressive-menu-item">
        <router-link :to="{ name: 'guess-drawing' }" class="text-decoration-none">
          <div class="card bg-transparent border-0 h-100 ">
            <div class="text-center p-5">
              <i class="bi bi-pencil fs-1 secondary-color"></i>
              <h5 class="card-title mt-3 mb-0">Deviner le dessin en anglais</h5>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div>
    </div>
  </div>

</template>