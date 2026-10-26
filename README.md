# Recording Reminder

BigBlueButton plugin (SDK `1.0.0-beta.3`, BBB 4.0) that reminds moderators to start the recording.

- Before the scheduled start (or when no start time is given): a small toast every `reminderInterval` minutes.
- At the scheduled start: a blocking alert that must be closed with a click.
- After the scheduled start: a toast every `lateReminderInterval` minutes.
- Once a recording has started in the meeting the plugin goes quiet for good, even if the recording is paused/stopped later
  (state comes from the server, so it also holds after a reload or for moderators who join later).

Only moderators are reminded, and only in meetings created with `record=true`, `allowStartStopRecording=true`
and without `autoStartRecording`.

## /create parameters

| Parameter | Default | Description |
|---|---|---|
| `plugin_RecordingReminder_startTime` | (none) | Scheduled start. ISO 8601 (`2026-10-26T14:00:00-03:00`), Unix timestamp (s or ms) or `HH:mm` (today, browser local time) |
| `plugin_RecordingReminder_reminderInterval` | `5` | Minutes between reminders before the start |
| `plugin_RecordingReminder_lateReminderInterval` | `2` | Minutes between reminders after the start |

URL-encode the value (`+` in an offset must be `%2B`, although a decoded space is also accepted).

These reach the plugin through placeholders in the manifest's `javascriptEntrypointUrl`, which bbb-web fills in per meeting.

## Build & install

```bash
npm install
npm run build-bundle
# copy dist/ to /var/www/bigbluebutton-default/assets/plugins/bbb-plugin-recording-reminder/
# and add {"url":"https://<host>/plugins/bbb-plugin-recording-reminder/manifest.json"} to
# pluginManifests in /etc/bigbluebutton/bbb-web.properties, then: sudo systemctl restart bbb-web
```
