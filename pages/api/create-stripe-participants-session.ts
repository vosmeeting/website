import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import queryString from 'query-string'
import { registrationTypes } from '../../constants/registrationType'
import { CreateParticipantCheckoutSesssionPayload } from '../../types'
import { db } from './constants/db'
import { If, Exists, Match, Index } from 'faunadb'
import { query as q } from 'faunadb'
import { serverClient } from './constants/fauna.instance'

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
      ? {
          email: firstParticipant.email,
          name: firstParticipant.fullName,
        }
      : registrant

    let savedRegistrant = await serverClient.query<{
      data: { customerId: string }
    }>(
      q.Let(
        {
          match: q.Match(q.Index('users_by_email'), registrant.email),
          data: { data: registrant },
        },
        q.If(q.Exists(q.Var('match')), q.Get(q.Var('match')), null)
      )
    )

    if (!savedRegistrant) {
      // customer will be saved in webhook handler
      savedRegistrant = await stripe.customers
        .create(registrantData)
        .then((cust) => {
          return serverClient.query(
            q.Create(q.Collection('users'), {
              data: {
                email: cust.email,
                name: cust.name,
                customerId: cust.id,
              },
            })
          )
        })
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

    await serverClient.query(
      q.Create(q.Collection('checkout_sessions'), {
        data: {
          id: checkoutSession.id,
          paymentIntent: checkoutSession.payment_intent,
          status: checkoutSession.status,
          customer: checkoutSession.customer,
          participants,
          secretUrlId,
        },
      })
    )

    res.status(200).json({ id: checkoutSession.id })
  } catch (e) {
    console.log('error', e)

    res.status(500).send(e)
  }
}

export default createStripeParticipantsSession
