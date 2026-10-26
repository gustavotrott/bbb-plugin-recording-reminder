import { ReminderConfig } from '../../commons/config';

export interface RecordingReminderProps {
  pluginName: string;
  pluginUuid: string;
  config: ReminderConfig;
}

export interface MeetingRecording {
  isRecording: boolean;
  startedAt: string | null;
}

export interface MeetingRecordingSubscriptionResult {
  meeting_recording: MeetingRecording[];
}

export interface RecordingPolicies {
  record: boolean;
  allowStartStopRecording: boolean;
  autoStartRecording: boolean;
}

export interface RecordingPoliciesSubscriptionResult {
  meeting_recordingPolicies: RecordingPolicies[];
}
