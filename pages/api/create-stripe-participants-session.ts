import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import queryString from 'query-string'
import { registrationTypes } from '../../constants/registrationType'
import { CreateParticipantCheckoutSesssionPayload } from '../../types'
import { db } from '../../infra/db'

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
    secretUrlId,
  } = req.body as CreateParticipantCheckoutSesssionPayload
  const firstParticipant = participants[0]
  const selfRegistrant = {
    email: firstParticipant.email,
    name: firstParticipant.fullName,
  }

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
            description: '5th Veterinary	Ophthalmic	Surgery	Meeting	Jul	19-22, 2024',
            images: [redirectUrl + '/vosm_logo.png'],
            metadata: { test: 'hello world' },
          },

          unit_amount: cents,
        },
        quantity: 1,
      }
    }
  )
  try {
    const registrantData: Stripe.CustomerCreateParams = registerForSelf
      ? selfRegistrant
      : registrant

    let savedRegistrant = await db.saveRegistrant(registrant)
    if (!savedRegistrant) {
      // customer will be saved in webhook handler just in case
      savedRegistrant = await stripe.customers
        .create(registrantData)
        .then((cust) => db.saveRegistrant(cust))
    }

    const today = new Date()

    const EXPIRATION_TIME_HOUR = 1
    const expInSeconds = Math.round(
      today.setHours(today.getHours() + EXPIRATION_TIME_HOUR) / 1000
    )

    // guard from creating the session if no seats are available
    const data = await db.getSeatAvailability()
    const seatAvailabilityCount = data.maxSeat - data.count
    const isSecretUrl = db.validateSecretUrl(secretUrlId)

    // special person bypass the availability count
    if (!isSecretUrl) {
      // check availability
      if (seatAvailabilityCount < lineItems.length) {
        if (seatAvailabilityCount === 0) {
          throw new Error('Sorry, we sold out!')
        }
        throw new Error(
          `Sorry, only ${seatAvailabilityCount} seat(s) are remaining`
        )
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      expires_at: expInSeconds, // expires in one hour
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
          secretUrlId,
        },
      }),
      customer: savedRegistrant.data.customerId,
    })

    await db.saveCheckoutSession(checkoutSession, participants, secretUrlId)
    res.status(200).json({ id: checkoutSession.id })
  } catch (e) {
    console.log('error', e)

    res.status(500).send(e)
  }
}

export default createStripeParticipantsSession
