class Country {
  name: string
  localName: string
  capitals: string[]
  flagPng: string
  flagSvg: string
  flagDescription: string
  alreadyUsed?: boolean

  constructor(data: any) {
    this.name = data.names?.common || ''
    this.localName = data.names?.translations?.fra.common || ''
    this.capitals = data.capital || []
    this.flagPng = data.flag?.url_png || ''
    this.flagSvg = data.flag?.url_svg || ''
    this.flagDescription = data.flags?.alt || ''
    this.alreadyUsed = false
  }
}

class RestCountriesService {
  private baseUrl: string
  private apiKey: string

  constructor(url: string, apiKey: string, mockAPI: boolean) {
    this.baseUrl = url
    this.apiKey = apiKey
  }

  async getCountries(): Promise<Country[]> {
    const STORAGE_KEY = 'restCountriesCache'
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      return parsed.map((c: any) => {
        const country = new Country({})
        country.name = c.name
        country.localName = c.localName
        country.capitals = c.capitals
        country.flagPng = c.flagPng
        country.flagSvg = c.flagSvg
        country.flagDescription = c.flagDescription
        country.alreadyUsed = c.alreadyUsed
        return country
      }).filter((c: { flagSvg: any }) => c.flagSvg)
    }

    return new Promise((resolve, reject) => {
      fetch(this.baseUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      }).then((response) => {
        response.json().then((results) => {
          const countries: Country[] = []
          if (results) {
            for (const result of results.data.objects) {
              const country = new Country(result)
              countries.push(country)
            }
          }
          if (countries.length==0){
            reject("error");
            return;
          }
          console.log(countries);
          const filtered = countries.filter(c => c.flagSvg)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
          resolve(filtered)
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
