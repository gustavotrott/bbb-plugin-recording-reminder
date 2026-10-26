import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as Styled from './styles';
import { ReminderModalProps } from './types';

// Rendered into document.body: the plugin container sits behind the client UI
function ReminderModal({
  title,
  description,
  hint,
  confirmLabel,
  onConfirm,
}: ReminderModalProps): React.ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return createPortal(
    <Styled.Overlay data-test="recordingReminderModal">
      <Styled.Dialog
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="recording-reminder-title"
        aria-describedby="recording-reminder-description"
      >
        <Styled.RecordIcon aria-hidden="true" />
        <Styled.Title id="recording-reminder-title">{title}</Styled.Title>
        <Styled.Description id="recording-reminder-description">{description}</Styled.Description>
        <Styled.Hint>{hint}</Styled.Hint>
        <Styled.ConfirmButton
          ref={buttonRef}
          type="button"
          onClick={onConfirm}
          data-test="recordingReminderConfirm"
        >
          {confirmLabel}
        </Styled.ConfirmButton>
      </Styled.Dialog>
    </Styled.Overlay>,
    document.body,
  );
}

export default ReminderModal;
