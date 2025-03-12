import { Pipe, PipeTransform } from "@angular/core";
import { num } from "../number";
import {
  CurrencyFormatOptions,
  NumberFormatOptions,
} from "../number/number.types";

@Pipe({
  name: "ngxNumber",
  standalone: true,
})
export class NumberPipe implements PipeTransform {
  transform(value: number, options?: NumberFormatOptions): string {
    return num.format(value, options);
  }
}

@Pipe({
  name: "ngxCurrency",
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, options?: CurrencyFormatOptions): string {
    return num.currency(value, options);
  }
}

@Pipe({
  name: "ngxPercent",
  standalone: true,
})
export class PercentPipe implements PipeTransform {
  transform(value: number, total?: number, decimals = 0): string {
    const percentage = total ? num.percentage(value, total, decimals) : value;
    return `${num.format(percentage, { decimals })} %`;
  }
}
