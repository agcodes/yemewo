export async function fetchRandomWord(): Promise<{ name: string; categorie: string }> {
  // Applique la fonction sur le nom du mot
  /*
  return {
    name: 'rez-',
    categorie: 'MAISON',
  }*/

  const response = await fetch('https://trouve-mot.fr/api/random')
  if (!response.ok) throw new Error('Impossible de récupérer un mot')
  const data = await response.json()
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

  return normalizedWord
}
