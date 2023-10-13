import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetBankHolidaysFunctionDefinition } from "../functions/show_bank_hols.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
const BankHolidaysWorkflow = DefineWorkflow({
  callback_id: "bank_holidays",
  title: "Bank holidayzzz",
  description: "Bank holidayz",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

const formData = BankHolidaysWorkflow.addStep(Schema.slack.functions.OpenForm, {
  title: "Bank hols",
  submit_label: "Submit form",
  description: "Get the next bank holidays for a given country and year",
  interactivity: BankHolidaysWorkflow.inputs.interactivity,
  fields: {
    required: ["channel", "year", "country"],
    elements: [
      {
        name: "country",
        title: "Country name",
        type: Schema.types.string,
      },
      {
        name: "year",
        title: "Year",
        type: Schema.types.string,
      },      
      {
        name: "channel",
        title: "Post in",
        type: Schema.slack.types.channel_id,
        default: BankHolidaysWorkflow.inputs.channel,
      },
    ],
  },
});

const getBankHolsStep = BankHolidaysWorkflow.addStep(GetBankHolidaysFunctionDefinition, {
  country: formData.outputs.fields.country,
  year: formData.outputs.fields.year
});

BankHolidaysWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: formData.outputs.fields.channel,
  message: getBankHolsStep.outputs.bankHolidays,
});

export default BankHolidaysWorkflow;
