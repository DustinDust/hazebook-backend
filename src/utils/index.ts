import * as moment from 'moment';

export { ResponseType } from './types/ResponseType';

export function parseDate(dateString: string): Date {
  return moment(dateString).toDate();
}

export function parseInt(numStr: string): number {
  if (Number(numStr) !== NaN) {
    return Number.parseInt(numStr);
  }
}
