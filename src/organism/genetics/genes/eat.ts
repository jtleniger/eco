export default class Eat {
  foodValue: number
  full: number
  huntRange: number
  eatRange: number

  constructor(foodValue: number, full: number, huntRange: number, eatRange: number) {
    this.foodValue = foodValue
    this.full = full
    this.huntRange = huntRange
    this.eatRange = eatRange
  }
}
