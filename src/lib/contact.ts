/** Turns the contact details into links. `+62 821…` becomes the digits-only form wa.me expects. */
/** `+6282184677520` -> `+62 821-8467-7520`. Anything that is not an Indonesian number is shown as given. */
export function formatPhone(phone: string): string {
  const m = /^\+62(\d{3})(\d{4})(\d+)$/.exec(phone)
  return m ? `+62 ${m[1]}-${m[2]}-${m[3]}` : phone
}

export function contactLinks(c: { phone: string; email: string }) {
  return {
    whatsapp: `https://wa.me/${c.phone.replace(/\D/g, '')}`,
    mailto: `mailto:${c.email}`,
  }
}
