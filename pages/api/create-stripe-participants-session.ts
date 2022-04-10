import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import queryString from 'query-string'
import { registrationTypes } from '../../constants/registrationType'
import { CreateParticipantCheckoutSesssionPayload } from '../../types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, undefined)

// eslint-disable-next-line import/no-anonymous-default-export
const createStripeParticipantsSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    participants,
    registerForSelf,
    registrant,
  } = req.body as CreateParticipantCheckoutSesssionPayload
  const firstParticipant = participants[0]

  const host = req.headers.host
  const protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:'
  const redirectUrl = protocol + '//' + host

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = participants.map(
    (p) => {
      const cents =
        registrationTypes.find((r) => r.value === p.registrationType).price *
        100
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Participant Registration As: ${p.registrationType?.toUpperCase()}`,
            description: '4th Veterinary	Ophthalmic	Surgery	Meeting	Jul	22-24, 2022',
            images: [redirectUrl + '/vosm_logo.png'],
            metadata: { ...p },
          },

          unit_amount: cents,
        },
        quantity: 1,
      }
    }
  )
  try {
    const custData: Stripe.CustomerCreateParams = registerForSelf
      ? {
          email: firstParticipant.email,
          name: firstParticipant.fullName,
        }
      : registrant

    const cust = await stripe.customers.create(custData)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: queryString.stringifyUrl({
        url: redirectUrl + '/payment-success',
        query: {
          from: '/register',
        },
      }),
      cancel_url: queryString.stringifyUrl({
        url: redirectUrl + '/register',
        query: {
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

export default createStripeParticipantsSession
