import { IntlShape } from 'react-intl';

export interface ReminderModalProps {
  intl: IntlShape;
  startTime: Date;
  onConfirm: () => void;
}
