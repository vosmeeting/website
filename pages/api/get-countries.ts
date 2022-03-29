// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import countryAlpha2 from './constants/countries'

export type Country = {
  country: string
  abbreviation: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Country[]>
) {
  res.status(200).json(countryAlpha2)
}
