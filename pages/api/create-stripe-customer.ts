import { NextApiRequest, NextApiResponse } from 'next'
import { stripeInteractor } from '../../infra/StripeInteractor'
import { Attendee } from '../../domain/Vendor'

// eslint-disable-next-line import/no-anonymous-default-export
const CreateStripeCustomer = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { email, name } = req.body

  try {
    const customer = new Attendee(email, name)
    const cust = await stripeInteractor.createCustomer(customer)

    console.log('created customer with:', cust)

    res.json({ id: cust.id })
  } catch (e) {
    const error = e as Error
    res.status(500).send(error.message)
  }
}

export default CreateStripeCustomer
