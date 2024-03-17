import { NextApiRequest, NextApiResponse } from 'next';
import { stripeInteractor } from '../../infra/StripeInteractor';
import { Attendee } from '../../domain/Vendor';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, name } = req.body;

  try {
    const customer = new Attendee(email, name);
    const cust = await stripeInteractor.createCustomer(customer);

    res.json({ id: cust.id });
  } catch (e) {
    const error = e as Error;
    res.status(500).send(error.message);
  }
};
