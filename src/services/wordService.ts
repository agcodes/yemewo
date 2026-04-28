import { API_CONFIG } from '@/config/apiConfig'
import type { Word } from '@/composables/Word'

export async function fetchRandomWord(): Promise<Word> {
    return new Promise((resolve, reject) => {
      fetch(API_CONFIG.WORD_API_URL).then((response) => {
        if (!response.ok) reject('Impossible de récupérer un mot')
         response.json().then((data) => {
            const wordData = data[0];
            if (data[0]){
              resolve({ value: wordData.name, category:  wordData.categorie });
              return;
            }
            reject(null);
         })
         .catch((error) => {
           reject(error);
         });
    });
  })
}
