import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundReal'
})
export class RoundRealPipe implements PipeTransform {

  transform(value: unknown, numDecimalPlaces: number): unknown {
    if (typeof value === 'number') {
      return value.toFixed(numDecimalPlaces);
    } else {
      return value;
    }
  }
}
