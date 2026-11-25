/** Turns the contact details into links. `+62 821…` becomes the digits-only form wa.me expects. */
export function contactLinks(c: { phone: string; email: string }) {
  return {
    whatsapp: `https://wa.me/${c.phone.replace(/\D/g, '')}`,
    mailto: `mailto:${c.email}`,
  }
}
