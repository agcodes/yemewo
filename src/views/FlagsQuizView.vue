<template>
    <FlagsQuiz />
   <div class="d-flex justify-content-center gap-3">
        <router-link :to="{ name: 'flags-quiz' }" class="text-decoration-none">
            <div class="btn-expressive border-gray ">
                Mode 4 drapeaux
            </div>
        </router-link>
        <router-link :to="{ name: 'guess-flag' }" class="text-decoration-none">  
            <div class="btn-expressive">
                Mode 1 drapeau
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import FlagsQuiz from '@/components/FlagsQuiz.vue'
</script>