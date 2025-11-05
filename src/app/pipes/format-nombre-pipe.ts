import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNombre',
  standalone: true,
})

export class FormatNombrePipe implements PipeTransform {
  transform(value: number, format: 'prime' | 'hauteur'): string {
    if (format === 'prime') {
      if (value > 1000000000) {
        return value / 1000000000 + 'Md';
      } else if (value > 1000000) {
        return value / 1000000 + 'M';
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
