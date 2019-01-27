import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Pipe({
    name: 'zapcurrency'
})
export class ZapcurrencyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let _result = '';
        let _number = 0;
        if (value !== undefined) {
            // tslint:disable-next-line:radix
            _number = parseInt(value);
            _number = _number / 100;
            _result = formatCurrency(_number, 'en', 'R ');
        } else {
            _result = formatCurrency(_number, 'en', 'R ');
        }

        return _result;
    }

}
