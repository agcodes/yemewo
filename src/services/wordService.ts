import { API_CONFIG } from '@/config/apiConfig'

export async function fetchRandomWord(): Promise<{ name: string; categorie: string }> {
  // Applique la fonction sur le nom du mot
  /*
  return {
    name: 'rez-',
    categorie: 'MAISON',
  }*/

    return new Promise((resolve, reject) => {
      fetch(API_CONFIG.WORD_API_URL).then((response) => {
        if (!response.ok) reject('Impossible de récupérer un mot')
         response.json().then((data) => {
            const wordData = data[0]
          
            // Fonction pour enlever les accents
            const removeAccents = (str: string): string => {
              return str
                .normalize('NFD') // Décompose les caractères accentués
                .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
            }
          
            // Applique la fonction sur le nom du mot
            const normalizedWord = {
              normalizedName: removeAccents(wordData.name),
              name: wordData.name,
              categorie: wordData.categorie,
            }
            resolve(normalizedWord);
         })
         .catch((error) => {
           reject(error);
         });
    });
  })
}
