import { NextApiRequest, NextApiResponse } from 'next';
import { stripeInteractor } from '../../infra/StripeInteractor';
import { Vendor } from '../../domain/Vendor';
import { VendorCheckoutSessionDTO } from '../../types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { item, vendor: _vendorDTO } = req.body as VendorCheckoutSessionDTO;

  const vendor = new Vendor(_vendorDTO.email, _vendorDTO.companyName, _vendorDTO.companyTelephone);

  const host = req.headers.host!;
  const protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:';
  const redirectURL = protocol + '//' + host;

  const session = await stripeInteractor.createVendorCheckoutSessions(item, vendor, redirectURL);
  try {
    res.json({ id: session.id });
  } catch (e) {
    const error = e as Error;
    res.status(500).send(error.message);
  }
};
