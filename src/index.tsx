import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import RecordingReminder from './components/recording-reminder/component';
import { parseReminderConfig } from './commons/config';

const uuid = document.currentScript?.getAttribute('uuid') || 'root';

const pluginName = document.currentScript?.getAttribute('pluginName') || 'plugin';

// Parameters from the /create call reach the plugin through placeholders in the
// manifest's javascriptEntrypointUrl, so they must be read while the script is running.
const config = parseReminderConfig((document.currentScript as HTMLScriptElement | null)?.src);

const root = ReactDOM.createRoot(document.getElementById(uuid));
root.render(
  <RecordingReminder {...{
    pluginUuid: uuid,
    pluginName,
    config,
  }}
  />,
);
