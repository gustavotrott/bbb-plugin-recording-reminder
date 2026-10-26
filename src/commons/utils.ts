import { IntlShape } from 'react-intl';

export const formatStartTime = (intl: IntlShape, startTime: Date) => {
  const isToday = startTime.toDateString() === new Date().toDateString();
  return intl.formatDate(startTime, isToday
    ? { hour: '2-digit', minute: '2-digit' }
    : {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
};
