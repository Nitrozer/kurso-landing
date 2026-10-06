import { defineConfig } from 'vite'

// La page est du HTML statique : pas de framework, pas d'hydratation. Vite ne
// sert plus qu'a empaqueter le script de mouvement, three.js et Lenis.
export default defineConfig({
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // three.js part dans son propre morceau, charge seulement quand la
        // scene 3D demarre : la page s'affiche sans l'attendre.
        manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined),
      },
    },
  },
})
