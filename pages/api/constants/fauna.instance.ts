import faunadb from 'faunadb'

// export const adminClient = ...

// general use
export const serverClient = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET,
})
