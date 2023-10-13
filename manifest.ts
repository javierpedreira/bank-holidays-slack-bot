import { Manifest } from "deno-slack-sdk/mod.ts";
import BankHolidaysWorkflow from "./workflows/bank_holidays.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "bank-holidays-app",
  description: "Post the following bank holidays for a given country and a year",
  icon: "assets/holidays.png",
  workflows: [BankHolidaysWorkflow],
  outgoingDomains: ["date.nager.at"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
