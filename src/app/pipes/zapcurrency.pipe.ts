import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Pipe({
    name: 'zapcurrency'
})
export class ZapcurrencyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let _number: number = parseInt(value);
        _number = _number / 100;
        let _result: string = formatCurrency(_number, 'en', 'R ');
        return _result;
    }

}
