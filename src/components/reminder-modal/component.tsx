import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { defineMessages } from 'react-intl';
import * as Styled from './styles';
import { ReminderModalProps } from './types';
import { formatStartTime } from '../../commons/utils';

const intlMessages = defineMessages({
  title: {
    id: 'recordingReminderPlugin.modal.title',
    description: 'Title of the alert shown at the scheduled meeting start',
    defaultMessage: 'It\'s time to start the meeting',
  },
  description: {
    id: 'recordingReminderPlugin.modal.description',
    description: 'Body of the alert shown at the scheduled meeting start',
    defaultMessage: 'The meeting was scheduled for {time}. Don\'t forget to start the recording!',
  },
  hint: {
    id: 'recordingReminderPlugin.modal.hint',
    description: 'Hint on where to find the recording button',
    defaultMessage: 'Use the recording button at the top of the screen.',
  },
  confirm: {
    id: 'recordingReminderPlugin.modal.confirm',
    description: 'Button that closes the alert shown at the scheduled meeting start',
    defaultMessage: 'Got it',
  },
});

// Rendered into document.body: the plugin container sits behind the client UI
function ReminderModal({
  intl,
  startTime,
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
        <Styled.Title id="recording-reminder-title">{intl.formatMessage(intlMessages.title)}</Styled.Title>
        <Styled.Description id="recording-reminder-description">
          {intl.formatMessage(intlMessages.description, {
            time: formatStartTime(intl, startTime),
          })}
        </Styled.Description>
        <Styled.Hint>{intl.formatMessage(intlMessages.hint)}</Styled.Hint>
        <Styled.ConfirmButton
          ref={buttonRef}
          type="button"
          onClick={onConfirm}
          data-test="recordingReminderConfirm"
        >
          {intl.formatMessage(intlMessages.confirm)}
        </Styled.ConfirmButton>
      </Styled.Dialog>
    </Styled.Overlay>,
    document.body,
  );
}

export default ReminderModal;
