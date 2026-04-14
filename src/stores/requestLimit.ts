// stores/requestLimit.ts
import { defineStore } from "pinia";

export const useRequestLimitStore = defineStore("requestLimit", {
  state: () => ({
    requestCount: 0,
    lastRequestTime: 0,
  }),
  actions: {
    incrementRequestCount() {
      const now = Date.now();
      this.requestCount++;
      this.lastRequestTime = now;
    },

    canMakeRequest(limit: number): boolean {
      const now = Date.now();
      const oneMinute = 60 * 1000; // Une minute en millisecondes

      if (now - this.lastRequestTime > oneMinute) {
        // Réinitialiser le compteur si la dernière requête était il y a plus d'une minute
        this.requestCount = 0;
      }
      return this.requestCount == 0 || this.requestCount < limit;
    },
  },
});
