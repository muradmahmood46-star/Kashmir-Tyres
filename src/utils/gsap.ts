import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/**
 * Micro-interaction for "Add to Cart" buttons — a quick scale-down then
 * elastic bounce back to normal size.
 */
export function animateCartButton(el: HTMLElement) {
  gsap.fromTo(
    el,
    { scale: 0.82 },
    {
      scale: 1,
      duration: 0.55,
      ease: 'elastic.out(1, 0.35)',
      transformOrigin: 'center',
    },
  )
}

/**
 * Fade-in + slide-up animation for hero content on page load.
 * Elements are animated with a stagger for a polished entrance.
 */
export function animateHeroEntrance(container: HTMLElement) {
  const targets = container.querySelectorAll('[data-hero-animate]')
  if (!targets.length) return

  gsap.fromTo(
    targets,
    { opacity: 0, y: 32 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'transform',
    },
  )
}

/**
 * Scroll-triggered fade/slide-in for product cards and other grid items.
 * Cards animate in as they enter the viewport.
 */
export function animateCardsOnScroll(container: HTMLElement, selector = '[data-scroll-animate]') {
  const cards = container.querySelectorAll(selector)
  if (!cards.length) return

  gsap.set(cards, { opacity: 0, y: 40 })

  cards.forEach((card) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 95%',
        toggleActions: 'play none none none',
        once: true,
      },
    })
  })
}