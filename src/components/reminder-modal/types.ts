export interface ReminderModalProps {
  title: string;
  description: string;
  hint: string;
  confirmLabel: string;
  onConfirm: () => void;
}
