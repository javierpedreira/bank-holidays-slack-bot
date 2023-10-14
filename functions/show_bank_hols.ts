import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

interface Countries {
  [key: string]: string
}

const countries: Countries = {
  'andorra':	'AD',
  'albania':	'AL',
  'argentina':	'AR',
  'austria':	'AT',
  'australia':	'AU',
  'åland islands':	'AX',
  'bosnia and herzegovina': 'BA',
  'barbados':	'BB',
  'belgium':	'BE',
  'bulgaria':	'BG',
  'benin':	'BJ',
  'bolivia':	'BO',
  'brazil':	'BR',
  'bahamas':	'BS',
  'botswana':	'BW',
  'belarus':	'BY',
  'belize':	'BZ',
  'canada':	'CA',
  'switzerland': 'CH',
  'chile': 'CL',
  'china': 'CN',
  'colombia': 'CO',
  'costa rica': 'CR',
  'cuba': 'CU',
  'cyprus': 'CY',
  'czechia': 'CZ',
  'germany': 'DE',
  'denmark': 'DK',
  'dominican republic': 'DO',
  'ecuador': 'EC',
  'estonia': 'EE',
  'egypt': 'EG',
  'spain': 'ES',
  'finland': 'FI',
  'faroe islands': 'FO',
  'france': 'FR',
  'gabon': 'GA',
  'united kingdom': 'GB',
  'grenada': 'GD',
  'guernsey': 'GG',
  'gibraltar': 'GI',
  'greenland': 'GL',
  'gambia': 'GM',
  'greece': 'GR',
  'guatemala': 'GT',
  'guyana': 'GY',
  'honduras': 'HN',
  'croatia': 'HR',
  'haiti': 'HT',
  'hungary': 'HU',
  'indonesia': 'ID',
  'ireland': 'IE',
  'isle of man': 'IM',
  'iceland': 'IS',
  'italy': 'IT',
  'jersey': 'JE',
  'jamaica': 'JM',
  'japan': 'JP',
  'south korea': 'KR',
  'liechtenstein': 'LI',
  'lesotho': 'LS',
  'lithuania': 'LT',
  'luxembourg': 'LU',
  'latvia': 'LV',
  'morocco': 'MA',
  'monaco': 'MC',
  'moldova': 'MD',
  'montenegro': 'ME',
  'madagascar': 'MG',
  'north macedonia': 'MK',
  'mongolia': 'MN',
  'montserrat': 'MS',
  'malta': 'MT',
  'mexico': 'MX',
  'mozambique': 'MZ',
  'namibia': 'NA',
  'niger': 'NE',
  'nigeria': 'NG',
  'nicaragua': 'NI',
  'netherlands': 'NL',
  'norway': 'NO',
  'new zealand': 'NZ',
  'panama': 'PA',
  'peru': 'PE',
  'papua new guinea': 'PG',
  'poland': 'PL',
  'puerto rico': 'PR',
  'portugal': 'PT',
  'paraguay': 'PY',
  'romania': 'RO',
  'serbia': 'RS',
  'russia': 'RU',
  'sweden': 'SE',
  'singapore': 'SG',
  'slovenia': 'SI',
  'svalbard and jan mayen': 'SJ',
  'slovakia': 'SK',
  'san marino': 'SM',
  'suriname': 'SR',
  'el salvador': 'SV',
  'tunisia': 'TN',
  'turkey': 'TR',
  'ukraine': 'UA',
  'united states': 'US',
  'uruguay': 'UY',
  'vatican city': 'VA',
  'venezuela': 'VE',
  'vietnam': 'VN',
  'south africa': 'ZA',
  'zimbabwe': 'ZW'  
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
