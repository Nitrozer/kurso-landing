import { renderToString } from 'react-dom/server'
import App from './App'
import Privacy from './Privacy'

export function render(): string {
  return renderToString(<App />)
}

/** La page de confidentialité, peinte au build elle aussi. Elle n'a aucune
 *  interactivité : elle part donc sans le moindre octet de JavaScript. */
export function renderPrivacy(): string {
  return renderToString(<Privacy />)
}
