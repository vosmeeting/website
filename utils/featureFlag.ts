const now = new Date().setHours(0, 0, 0, 0)
const due = new Date('4/13/2022').setHours(0, 0, 0, 0)
const overdue = now > due

export const flags = {
  registration: true,
  sponsors: true,
}
