import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import BankHolidaysWorkflow from "../workflows/bank_holidays.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const trigger: Trigger<typeof BankHolidaysWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "What are my bank holidays?",
  description: "Starts the workflow to find out my bank holidays",
  workflow: `#/workflows/${BankHolidaysWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default trigger;
