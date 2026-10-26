export const MEETING_RECORDING = `
subscription RecordingReminderMeetingRecording {
  meeting_recording {
    isRecording
    startedAt
  }
}
`;

export const RECORDING_POLICIES = `
subscription RecordingReminderRecordingPolicies {
  meeting_recordingPolicies {
    record
    allowStartStopRecording
    autoStartRecording
  }
}
`;
