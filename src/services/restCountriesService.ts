class Country {
  name: string
  localName: string
  capitals: string[]
  flagPng: string
  flagSvg: string
  flagDescription: string
  alreadyUsed?: boolean

  constructor(data: any) {
    this.name = data.name?.common || ''
    this.localName = data.translations?.fra.common || ''
    this.capitals = data.capital || []
    this.flagPng = data.flags?.png || ''
    this.flagSvg = data.flags?.svg || ''
    this.flagDescription = data.flags?.alt || ''
    this.alreadyUsed = false
  }
}

class RestCountriesService {
  private baseUrl: string

  constructor(url: string, mockAPI: boolean) {
    this.baseUrl = url
  }

  async getCountries(): Promise<Country[]> {
    return new Promise((resolve, reject) => {
      fetch(this.baseUrl).then((response) => {
        response.json().then((results) => {
          const countries: Country[] = []
          if (results) {
            for (const result of results) {
              const country = new Country(result)
              countries.push(country)
            }

            if (countries && countries.length > 0) {
              resolve(countries)
              return
            }
          }
          reject("Erreur de chargement des pays")
        });
      })
      .catch((error) => {
        reject(error);
      });
    })
  }

  async getCountry(name: string): Promise<Country> {
    const countries = await this.getCountries()
    const foundIndex = countries.findIndex((country) => country.name === name)
    if (foundIndex >= 0) {
      return countries[foundIndex]!
    }
    return new Country({})
  }

  async getRandomCountry(): Promise<Country> {
    const countries = await this.getCountries()
    if (countries.length > 0) {
      const randomIndex = Math.floor(Math.random() * countries.length)
      return countries[randomIndex]!
    }
    return new Country({})
  }
}

export { Country, RestCountriesService }
