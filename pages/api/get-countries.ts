// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import COUNTRIES, { Countries } from '../../constants/countries'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Countries>
) {
  res.status(200).json(COUNTRIES)
}
