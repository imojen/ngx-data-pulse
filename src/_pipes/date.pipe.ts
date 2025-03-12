import { Pipe, PipeTransform } from "@angular/core";
import { date } from "../dates";
import { DateFormatOptions } from "../dates/date.types";

@Pipe({
  name: "ngxDate",
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(
    value: string | number | Date,
    options?: DateFormatOptions
  ): string {
    return date.format(value, options);
  }
}

@Pipe({
  name: "ngxFromNow",
  standalone: true,
})
export class FromNowPipe implements PipeTransform {
  transform(value: string | number | Date): string {
    return date.fromNow(value);
  }
}

@Pipe({
  name: "ngxApiDate",
  standalone: true,
})
export class ApiDatePipe implements PipeTransform {
  transform(value: string | number | Date): string {
    return date.toApiDate(value);
  }
}
