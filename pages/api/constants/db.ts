const wait = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))
export const db = {
  getSeatAvailability: () => wait(300).then(() => 100),
}
