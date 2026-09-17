export class Country {
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
