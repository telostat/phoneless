import express, { Application, Request, Response } from 'express';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

export function serve(port: number): void {
  const app: Application = express();

  app.get('/validate', validateEndpoint);

  app.listen(port, () => console.log(`phoneless HTTP server has started and is listening on port ${port}.`));
}

export function validateEndpoint(req: Request, res: Response): void {
  // Attempt to get the phone number query parameter if provided:
  const query = getStringParam(req, 'p');

  // Check if the phone number is provided:
  if (!query) {
    res.sendStatus(400);
    res.send({ error: 'Invalid query: Expecting a single "p" parameter.' });
    return;
  }

  // Get an instance of `PhoneNumberUtil`.
  const phoneUtil = PhoneNumberUtil.getInstance();

  // Attempt to parse the query:
  try {
    const number = phoneUtil.parse(query);
    res.send({
      valid: true,
      details: {
        region: phoneUtil.getRegionCodeForNumber(number),
        type: {
          number: phoneUtil.getNumberType(number),
          code: findPhoneNumberType(phoneUtil.getNumberType(number)),
          text: findPhoneNumberType(phoneUtil.getNumberType(number)).toLowerCase().replace('_', ' '),
        },
        input: query,
        formatted: {
          e164: phoneUtil.format(number, PhoneNumberFormat.E164),
          national: phoneUtil.format(number, PhoneNumberFormat.NATIONAL),
          international: phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL),
          rfc3966: phoneUtil.format(number, PhoneNumberFormat.RFC3966),
        },
      },
    });
  } catch (err: unknown) {
    let message = 'Unknown error';

    if (typeof err === 'string') {
      message = err;
    } else if (err instanceof Error) {
      message = err.message;
    }

    res.send({ valid: false, details: message });
  }
}

export function getStringParam(req: Request, key: string): string | undefined {
  const param = req.query[key] || undefined;

  if (param === undefined) {
    return undefined;
  } else if (typeof param === 'string') {
    return param;
  } else if (Array.isArray(param)) {
    if (typeof param[0] === 'string') {
      return param[0];
    }
  }
  return undefined;
}

export const PhoneNumberTypeMap: Record<number, string> = {
  0: 'FIXED_LINE',
  1: 'MOBILE',
  2: 'FIXED_LINE_OR_MOBILE',
  3: 'TOLL_FREE',
  4: 'PREMIUM_RATE',
  5: 'SHARED_COST',
  6: 'VOIP',
  7: 'PERSONAL_NUMBER',
  8: 'PAGER',
  9: 'UAN',
  10: 'VOICEMAIL',
  [-1]: 'UNKNOWN',
};

export function findPhoneNumberType(type: number): string {
  return PhoneNumberTypeMap[type] || PhoneNumberTypeMap[-1];
}

serve(Number.parseInt(process.env['PORT'] || '3001'));
