# CLAUDE.md — Dial Funghi Shop

## Progetto
Sito e-commerce statico per Dial Funghi (Pergine Valsugana, Trentino, 1992).
Fior di Funghi (squeeze mushroom sauce) è la linea hero.
Tech stack: HTML, CSS, JS vanilla. Pagamenti: Stripe Payment Links.

## Prodotti Fior di Funghi
- Porcini e Speck
- Tartufo e Pecorino
- Paprika e BBQ
- Teriyaki e Zenzero (Limited Edition)

## Sub-brand
- Oro della Montagna (mercato italiano)
- Bosco's (export)

## Struttura File
index.html, shop.html, product.html, recipes.html, cart.html,
about.html, faq.html, contact.html, styles.css, scripts.js

## Design System
- Font: Playfair Display (titoli), Oswald (CTA), DM Sans (body)
- Colori: Cream #FFF8F0, Orange #E8722A, Gold #C5A55A, Dark #2D2926
- Mobile-first, max-width 1440px

## Regole Assolute
- Sempre mobile-first
- Semantic HTML5, no React/Vue/framework
- No backend, no database, no jQuery, no Tailwind
- Performance: lazy load immagini, minify CSS/JS
- Accessibilità: ARIA labels, alt text, focus states
- SEO: meta title/description ogni pagina, schema.org structured data

## Animazioni
- GSAP per scroll animations e timeline
- Three.js per product 3D showcase (bottiglie Fior di Funghi)
- Swiper.js per carousel touch-friendly
- vanilla-tilt.js per card hover tilt
- Lenis per smooth scrolling
- Lottie per micro-animazioni

## Siti di Riferimento
truff.com, graza.co, mutti-parma.com, partakefoods.com, liquid-death.com

## Asset Disponibili
Immagini bottiglie con sfondo rimosso nella cartella corrente:
- porcini-clean.png
- tartufo-clean.png
- bbq-clean.png
- teriyaki-clean.png
