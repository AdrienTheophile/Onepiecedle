import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNombre',
  standalone: true,
})

export class FormatNombrePipe implements PipeTransform {

  truncate (value: number, decimals: number): number {
    const fact = Math.pow(10, decimals)
    return Math.floor(value * fact) / fact
  }

  transform(value: number, format: 'prime' | 'hauteur'): string {
    if (format === 'prime') {
      if (value > 1000000000) {
        let new_value = value / 1000000000;
        return this.truncate(new_value, 2) + 'Md';
      } else if (value > 1000000) {
        let new_value = value / 1000000;
        return this.truncate(new_value, 2) + 'M';
      } else {
        return value + '';
      }
    }

    if (format === 'hauteur') {
      return value / 100 + 'm';
    } else {
      return value + '';
    }
  }
}
