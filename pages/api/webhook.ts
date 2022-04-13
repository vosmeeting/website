import { NextApiHandler } from 'next'
import { query as q } from 'faunadb'
import { stripe } from './constants/stripe.instance'
import { buffer } from 'micro'
import Stripe from 'stripe'
import { serverClient } from './constants/fauna.instance'
import { logger } from '../../utils/logger'

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
    logger.error('error', err)
    return response.status(400).send(`Webhook Error: ${err.message}`)
  }
  const sessionData = event.data.object as any

  switch (event.type) {
    case 'checkout.session.completed':
      logger.log(event.type, sessionData)
      // the one comes from webhook doesn't contain the `status`
      // which is important
      const theCorrectSessionData = await stripe.checkout.sessions.retrieve(
        sessionData.id
      )

      logger.log('the correct sessionData', theCorrectSessionData)

      return updateCheckoutSession(theCorrectSessionData)
        .then((checkoutSession: any) => {
          logger.log('updated checkout session in db', checkoutSession)
          response.status(200).send('ok')
        })
        .catch((err) => {
          return response.status(400).send(`Fulfillment Error: ${err.message}`)
        })
    case 'checkout.session.expired':
      const correctExpiredSessionData = await stripe.checkout.sessions.retrieve(
        sessionData.id
      )
      return updateCheckoutSession(correctExpiredSessionData)
        .then((checkoutSession: any) => {
          logger.log('updated checkout session in db', checkoutSession)
          response.status(200).send('ok')
        })
        .catch((err) => {
          return response.status(400).send(`Fulfillment Error: ${err.message}`)
        })
    case 'payment_intent.created':
      logger.log(event.type, sessionData)
      await serverClient
        .query(q.Create(q.Collection('payment_intents'), { data: sessionData }))
        .then((p) => response.status(200).send(p))
        .catch((e) => response.status(500).send(e))
      // TODO: email the registrant of ongoing payment and attach the session.url
      break
    case 'payment_intent.succeeded':
      return updatePaymentIntent(sessionData)
        .then((intent) => {
          logger.log('successfully handleed update intent', intent)

          response.send('ok')
          if (!intent) logger.error('payment intent not found')
        })
        .catch((e) => response.status(500).send(e))

    case 'payment_intent.cancelled':
      logger.log(event.type, sessionData)

      return updatePaymentIntent(sessionData)
        .then((intent) => {
          response.send('ok')
          if (!intent) logger.error('payment intent not found')
        })
        .catch((e) => response.status(500).send(e))
    case 'customer.created':
      // handle customer creation
      // TODO: save user as 'registrant'
      const cust = sessionData
      logger.log('webook cust', cust)

      // don't handle this case
      // customer creation has been handled checkout session creation
      response.send('ok')
      break
    case 'charge.succeeded':
      return saveCharge(sessionData)
        .then((charge) => {
          response.send('ok')
        })
        .catch((e) => {
          response.status(500).send(e)
        })
    case 'charge.refunded':
      return updateCharge(sessionData)
        .then((charge) => {
          if (!charge) logger.error('charge not found')
          response.status(200).send('ok')
        })
        .catch((e) => {
          logger.error(e)
          response.status(500).send(e)
        })
    default:
      logger.error('unhandled event: ', event.type)
      logger.log(event.type, sessionData)
      response.send('unhandled event')
      break
  }
}

function saveCharge(charge) {
  return serverClient.query(q.Create(q.Collection('charges'), { data: charge }))
}

function updateCharge(charge: Stripe.Charge) {
  return serverClient.query(
    q.Let(
      {
        match: q.Match(q.Index('charges_by_id'), charge.id),
        data: { data: charge },
      },
      q.If(
        q.Exists(q.Var('match')),
        q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
        null
      )
    )
  )
}

function updatePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  return serverClient.query(
    q.Let(
      {
        match: q.Match(q.Index('payment_intents_by_id'), paymentIntent.id),
        data: { data: paymentIntent },
      },
      q.If(
        q.Exists(q.Var('match')),
        q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
        null
      )
    )
  )
}

export function updateCheckoutSession(session: Stripe.Checkout.Session) {
  const payload = {
    id: session.id,
    paymentIntent: session.payment_intent,
    status: session.status,
    customer: session.customer,
  }
  return serverClient.query(
    q.Let(
      {
        match: q.Match(q.Index('checkout_sessions_by_id'), payload.id),
        data: { data: payload },
      },
      q.If(
        q.Exists(q.Var('match')),
        q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
        null
      )
    )
  )
}
export default handler
