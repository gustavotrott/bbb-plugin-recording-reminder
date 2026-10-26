import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  BbbPluginSdk,
  PluginApi,
  pluginLogger,
} from 'bigbluebutton-html-plugin-sdk';
import { NotificationTypeUiCommand } from 'bigbluebutton-html-plugin-sdk/dist/cjs/ui-commands/notification/enums';
import { defineMessages, IntlShape } from 'react-intl';
import { useGetInternationalization } from '../../commons/hooks';
import ReminderModal from '../reminder-modal/component';
import {
  MeetingRecordingSubscriptionResult,
  RecordingPoliciesSubscriptionResult,
  RecordingReminderProps,
} from './types';
import { MEETING_RECORDING, RECORDING_POLICIES } from './subscriptions';

const intlMessages = defineMessages({
  toastBeforeStart: {
    id: 'recordingReminderPlugin.toast.beforeStart',
    description: 'Periodic reminder shown when no meeting start time was given',
    defaultMessage: 'Don\'t forget to start the recording!',
  },
  toastBeforeStartWithTime: {
    id: 'recordingReminderPlugin.toast.beforeStartWithTime',
    description: 'Periodic reminder shown before the scheduled meeting start',
    defaultMessage: 'The meeting starts at {time}. Don\'t forget to start the recording!',
  },
  toastLate: {
    id: 'recordingReminderPlugin.toast.late',
    description: 'Periodic reminder shown after the scheduled meeting start',
    defaultMessage: 'The meeting has already started ({time}) and it is not being recorded yet. Start the recording!',
  },
  modalTitle: {
    id: 'recordingReminderPlugin.modal.title',
    description: 'Title of the alert shown at the scheduled meeting start',
    defaultMessage: 'It\'s time to start the meeting',
  },
  modalDescription: {
    id: 'recordingReminderPlugin.modal.description',
    description: 'Body of the alert shown at the scheduled meeting start',
    defaultMessage: 'The meeting was scheduled for {time}. Don\'t forget to start the recording!',
  },
  modalHint: {
    id: 'recordingReminderPlugin.modal.hint',
    description: 'Hint on where to find the recording button',
    defaultMessage: 'Use the recording button at the top of the screen.',
  },
  modalConfirm: {
    id: 'recordingReminderPlugin.modal.confirm',
    description: 'Button that closes the alert shown at the scheduled meeting start',
    defaultMessage: 'Got it',
  },
});

// How often the reminder state is evaluated
const TICK_INTERVAL_MS = 5000;
// Delay between joining and the first soft reminder
const FIRST_REMINDER_DELAY_MS = 20000;
const TOAST_AUTO_CLOSE_MS = 10000;

const formatStartTime = (intl: IntlShape, startTime: Date) => {
  const isToday = startTime.toDateString() === new Date().toDateString();
  return intl.formatDate(startTime, isToday
    ? { hour: '2-digit', minute: '2-digit' }
    : {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
};

function RecordingReminder(
  { pluginUuid: uuid, config }: RecordingReminderProps,
): React.ReactElement {
  BbbPluginSdk.initialize(uuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);
  const { intl } = useGetInternationalization(pluginApi);

  const { data: currentUser } = pluginApi.useCurrentUser() || {};
  const { data: recordingData } = pluginApi
    .useCustomSubscription<MeetingRecordingSubscriptionResult>(MEETING_RECORDING);
  const { data: policiesData } = pluginApi
    .useCustomSubscription<RecordingPoliciesSubscriptionResult>(RECORDING_POLICIES);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Once a recording has started in this meeting the plugin never reminds again,
  // even if it is stopped later
  const [hasRecorded, setHasRecorded] = useState(false);
  const modalShownRef = useRef(false);
  const modalOpenRef = useRef(false);
  modalOpenRef.current = isModalOpen;
  const lastReminderAtRef = useRef<number | null>(null);

  const recording = recordingData?.meeting_recording?.[0];
  const policies = policiesData?.meeting_recordingPolicies?.[0];

  useEffect(() => {
    if (!hasRecorded && (recording?.isRecording || recording?.startedAt)) {
      pluginLogger.info('RecordingReminder: recording started, reminders disabled');
      setHasRecorded(true);
      setIsModalOpen(false);
    }
  }, [recording, hasRecorded]);

  const isModerator = currentUser?.role === 'MODERATOR';
  const canRecord = !!policies && policies.record
    && policies.allowStartStopRecording && !policies.autoStartRecording;
  const isActive = isModerator && canRecord && !!recordingData && !!intl && !hasRecorded;

  useEffect(() => {
    if (!isActive) return undefined;
    const { startTime, reminderIntervalMinutes, lateReminderIntervalMinutes } = config;

    const tick = () => {
      const now = Date.now();
      const isLate = !!startTime && now >= startTime.getTime();
      const intervalMs = (isLate ? lateReminderIntervalMinutes : reminderIntervalMinutes) * 60000;
      if (lastReminderAtRef.current === null) {
        lastReminderAtRef.current = now - intervalMs + FIRST_REMINDER_DELAY_MS;
      }

      if (isLate && !modalShownRef.current) {
        modalShownRef.current = true;
        lastReminderAtRef.current = now;
        setIsModalOpen(true);
        return;
      }

      // The interval restarts when the alert is closed
      if (modalOpenRef.current) {
        lastReminderAtRef.current = now;
        return;
      }

      if (now - lastReminderAtRef.current < intervalMs) return;
      lastReminderAtRef.current = now;

      let message: string;
      if (isLate) {
        message = intl.formatMessage(intlMessages.toastLate, {
          time: formatStartTime(intl, startTime),
        });
      } else if (startTime) {
        message = intl.formatMessage(intlMessages.toastBeforeStartWithTime, {
          time: formatStartTime(intl, startTime),
        });
      } else {
        message = intl.formatMessage(intlMessages.toastBeforeStart);
      }
      pluginApi.uiCommands.notification.send({
        message,
        icon: 'record',
        type: isLate ? NotificationTypeUiCommand.ERROR : NotificationTypeUiCommand.WARNING,
        options: { autoClose: TOAST_AUTO_CLOSE_MS },
      });
    };

    tick();
    const interval = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isActive, intl, config]);

  if (!isModalOpen || !intl || hasRecorded) return null;

  return (
    <ReminderModal
      title={intl.formatMessage(intlMessages.modalTitle)}
      description={intl.formatMessage(intlMessages.modalDescription, {
        time: formatStartTime(intl, config.startTime),
      })}
      hint={intl.formatMessage(intlMessages.modalHint)}
      confirmLabel={intl.formatMessage(intlMessages.modalConfirm)}
      onConfirm={() => setIsModalOpen(false)}
    />
  );
}

export default RecordingReminder;
