import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilter'
})
export class CustomFilterPipe implements PipeTransform {

  transform(items: any, term: string, excludes: any = []): any {
    if (!term || !items) return items;
    return CustomFilterPipe.filter(items, term, excludes);
  }

  static filter(
    items: Array<{ [key: string]: any }>,
    term: string,
    excludes: any
  ): Array<{ [key: string]: any }> {
    const toCompare = term.toLowerCase();
  
    return items.filter(function (item) {
      // Acceder al atributo 'nombre' utilizando corchetes
      if (item['nombre'] && item['nombre'].toString().toLowerCase().includes(toCompare)) {
        return true;
      }
      return false;
    });
  }
  
}
