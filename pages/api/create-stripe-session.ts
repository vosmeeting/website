import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import queryString from 'query-string'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, undefined)

// eslint-disable-next-line import/no-anonymous-default-export
const CreateStripeSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { item, vendor } = req.body

  // const dollar = calcPrice(item)
  const cents = Number(item.amount) * 100

  const host = req.headers.host
  const protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:'
  const redirectURL = protocol + '//' + host

  const transformedItem = {
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Application	for	Commercial	Exhibits and	Sponsorship',
        description: '4th Veterinary	Ophthalmic	Surgery	Meeting	Jul	22-24, 2022',
        images: [redirectURL + '/vosm_logo.png'],
      },
      unit_amount: cents,
    },
    quantity: 1,
  }

  try {
    const cust = await stripe.customers.create({
      email: vendor.email,
      name: vendor.companyName,
      phone: vendor.companyTelephone,
    })
    console.log('created customer', cust)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [transformedItem],
      mode: 'payment',
      success_url: redirectURL + '/payment-success',
      cancel_url: queryString.stringifyUrl({
        url: redirectURL + '/vendor',
        query: {
          ...vendor,
          ...item,
          error: 'payment was cancelled',
        },
      }),
      customer: cust.id,
    })
    console.log('created session', session)

    res.json({ id: session.id })
  } catch (e) {
    res.status(500).send(e.message)
  }
}

export default CreateStripeSession
