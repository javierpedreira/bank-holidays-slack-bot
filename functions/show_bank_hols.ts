import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

interface Countries {
  [key: string]: string
}

const countries: Countries = {
  'spain': 'ES',
  'españa': 'ES',
  'united kingdom': 'GB',
  'uk': 'GB',
  'argentina': 'AR',
  'france': "FR",
  'francia': "FR"
};

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const GetBankHolidaysFunctionDefinition = DefineFunction({
  callback_id: "bank_hols",
  title: "Bank Holidays",
  description: "Takes a country name and a year and gets its bank holidays",
  source_file: "functions/show_bank_hols.ts",
  input_parameters: {
    properties: {
      year: {
        type: Schema.types.number,
        description: "The year you want to consult bank holidays",
      },      
      country: {
        type: Schema.types.string,
        description: "Name of the country you want to query the next bank holidays",
      },
    },
    required: ["country", "year"],
  },
  output_parameters: {
    properties: {
      bankHolidays: {
        type: Schema.types.string,
        description: "The bank holidays",
      },
    },
    required: ["bankHolidays"],
  },
});

export default SlackFunction(
  GetBankHolidaysFunctionDefinition,
  async ({ inputs }) => {

    const data = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${inputs.year}/${countries[inputs.country.toLocaleLowerCase()]}`);
    if (!data.ok) {
      return {
        error: `OH NO! I can't find holidays for ${inputs.country} and ${inputs.year}`,
      };      
    }
    const result = await data.json()
    const today = new Date();

    const filteredHolidays = result.filter((item: { date: string|number|Date; }) => {
      const eventDate = new Date(item.date);
      return eventDate > today;
    }).map((item: { date: string; name: string; }) => `${item.date} - ${item.name}`).join(',\n ')

    const bankHolidays = `These are following bank ${inputs.year} holidays for \`${inputs.country}\`:\n ${filteredHolidays}`;
  
    return {
      outputs: { bankHolidays },
    };
  },
);
