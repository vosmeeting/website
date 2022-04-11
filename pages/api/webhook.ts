import { NextApiHandler } from 'next'
import { stripe } from './constants/stripe.instance'
import { buffer } from 'micro'
import Stripe from 'stripe'

// Stripe requires the raw body to construct the event, so we have to diable the next parser
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler: NextApiHandler = async (request, response) => {
  const buf = await buffer(request)
  const sig = request.headers['stripe-signature']
  const endpointSecret = process.env.WEBHOOK_SECRET

  let event: Stripe.Event | never

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
  } catch (err) {
    console.error('error', err)
    return response.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as any
      stripe.checkout.sessions
        .listLineItems(session.id, { limit: 100 })
        .then((lineItems) => {
          // process the participant registration list
          // remove inventory by items.length
          // notify the participants of the event
          // send registrant the invoice
        })
        .catch((err) => {
          return response.status(400).send(`Fulfillment Error: ${err.message}`)
        })
      break
    case 'payment_intent.created':
      // TODO: temporarily substract the inventory
      // TODO: email the registrant of ongoing payment and attach the session.url
      break
    case 'payment_intent.expired':
      // TODO: revert substracting from payment_intent.created
      break
    default:
      console.error('unhandled event')
      break
  }

  response.send()
}

const handler2 = async (req, res) => {
  console.log(req.headers)
}

export default handler
