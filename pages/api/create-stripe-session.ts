import { NextApiResponse } from 'next'
// import calcPrice from "../../services/calc-price";
import omit from 'lodash/omit'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, undefined)

// eslint-disable-next-line import/no-anonymous-default-export
const CreateStripeSession = async (req, res: NextApiResponse) => {
  const { item, vendor } = req.body

  // const dollar = calcPrice(item)
  const cents = Number(item.amount) * 100

  const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_HOST

  const transformedItem = {
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Application	for	Commercial	Exhibits and	Sponsorship',
        description: '4th Veterinary	Ophthalmic	Surgery	Meeting	Jul	22-24, 2022',
        images: item.images,
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
      cancel_url: redirectURL + '/payment-failed',
      customer: cust.id,
    })
    console.log('created session', session)

    res.json({ id: session.id })
  } catch (e) {
    res.status(500).send(e.message)
  }
}

export default CreateStripeSession
