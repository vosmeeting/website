import { NextApiResponse } from 'next'
// import calcPrice from "../../services/calc-price";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, undefined)

// eslint-disable-next-line import/no-anonymous-default-export
const CreateStripeCustomer = async (req, res: NextApiResponse) => {
  const { email, name } = req.body

  try {
    const cust = await stripe.customers.create({
      email: email,
      name: name,
    })

    console.log('created customer with:', cust)

    res.json({ id: cust.id })
  } catch (e) {
    res.status(500).send(e.message)
  }
}

export default CreateStripeCustomer
