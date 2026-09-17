import { API_CONFIG } from '@/config/apiConfig'
import { Country } from './Country'

class RestCountriesService {
  private baseUrl: string
  private apiKey: string

  constructor(
    baseUrl: string = API_CONFIG.REST_COUNTRIES_URL,
    apiKey: string = API_CONFIG.REST_COUNTRIES_API_KEY
  ) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async getCountries(): Promise<Country[]> {
    const STORAGE_KEY = 'restCountriesCache'
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      return parsed
        .map((c: any) => {
          const country = new Country({})
          country.name = c.name
          country.localName = c.localName
          country.capitals = c.capitals
          country.flagPng = c.flagPng
          country.flagSvg = c.flagSvg
          country.flagDescription = c.flagDescription
          country.alreadyUsed = c.alreadyUsed
          return country
        })
        .filter((c: { flagSvg: any }) => c.flagSvg)
    }

    return new Promise((resolve, reject) => {
      fetch(this.baseUrl, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
        .then((response) => {
          response.json().then((results) => {
            const countries: Country[] = []
            if (results) {
              for (const result of results.data.objects) {
                const country: Country = new Country(result)
                countries.push(country)
              }
            }
            if (countries.length == 0) {
              reject('error')
              return
            }
            const filtered: Country[] = countries.filter((c) => c.flagSvg)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
            resolve(filtered)
          })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  async getCountry(name: string): Promise<Country> {
    const countries: Country[] = await this.getCountries()
    const foundIndex: number = countries.findIndex((country) => country.name === name)
    if (foundIndex >= 0) {
      return countries[foundIndex]!
    }
    return new Country({})
  }

  async getSvgFlag(country: Country): Promise<string> {
    let svgString: string = ''
    if (country && country.flagSvg) {
      let flagSvg: string = country.flagSvg
      const flagUrl: string = flagSvg

      try {
        const response = await fetch(API_CONFIG.PROXY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: flagUrl }),
        })
        if (response.ok) {
          svgString = await response.text()
        }
      } catch (ex) {
        svgString = ''
      }
      return svgString ?? ''
    }
    return ''
  }

  async getSvgFlag_(country: Country): Promise<string> {
    let svgString: string = ''
    if (country && country.flagSvg) {
      //let flagSvg = "https://flags.restcountries.com/v5/svg/cx.svg";
      //let flagSvg = "https://flags.restcountries.com/v5/svg/fr.svg";
      // let flagSvg = "https://flags.restcountries.com/v5/svg/np.svg";
      //let flagSvg = "https://flags.restcountries.com/v5/svg/es.svg";
      let flagSvg: string = country.flagSvg // "https://flags.restcountries.com/v5/svg/ar.svg";

      const flagUrl: string = flagSvg

      try {
        const response = await fetch(flagUrl)
        if (response.ok) {
          svgString = await response.text()
        }
      } catch (ex) {
        svgString = ''
      }
      return svgString ?? ''
    }
    return ''
  }
  async getRandomCountry(): Promise<Country> {
    const countries: Country[] = await this.getCountries()
    if (countries.length > 0) {
      const randomIndex: number = Math.floor(Math.random() * countries.length)
      return countries[randomIndex]!
    }
    return new Country({})
  }
}

export { Country, RestCountriesService }
