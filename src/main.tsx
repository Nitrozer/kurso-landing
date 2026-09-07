import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const root = document.getElementById('root')!
// La page est pre-rendue au build : on hydrate ce qui est deja peint,
// et on ne repart de zero que si le HTML statique manque.
if (root.hasChildNodes()) hydrateRoot(root, <StrictMode><App /></StrictMode>)
else createRoot(root).render(<StrictMode><App /></StrictMode>)
