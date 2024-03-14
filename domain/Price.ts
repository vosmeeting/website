export class Price extends Number {
  constructor(value: number | string) {
    super(value);
  }

  toDollar() {
    return this.toLocaleString('en-us', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  }
}
