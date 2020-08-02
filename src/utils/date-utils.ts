import * as moment from 'moment';
const DEFAULT_FORMAT = 'LL LT';

export const formatDateFromString = (date: string, dateFormat: string = DEFAULT_FORMAT) => {
    const result = moment(date).format(dateFormat);
    return result;
}
