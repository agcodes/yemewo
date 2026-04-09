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
    // mockAPI parameter is reserved for future use
  }

  async getCountries(): Promise<Country[]> {
    const response = await fetch(this.baseUrl)
    const results = await response.json()

    const countries: Country[] = []
    if (results) {
      for (const result of results) {
        const country = new Country(result)
        countries.push(country)
      }
    }
    return countries
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

  async getRandomCountries(nb: number): Promise<Country[]> {
    const countries = await this.getCountries()
    const shuffled = [...countries].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, nb)
  }
}

export { Country, RestCountriesService }
