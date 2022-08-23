export default class Gene {
  value: number
  minValue: number
  maxValue: number

  constructor(value: number, minValue: number, maxValue: number) {
    this.value = value
    this.minValue = minValue
    this.maxValue = maxValue
  }
}
