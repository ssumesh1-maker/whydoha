import 'lenis/dist/lenis.css'
import './styles.css'

export const metadata = {
  title: 'Why Doha | A City Ready to Welcome',
  description: 'Explore the ambition, venues and people behind Doha’s Olympic and Paralympic bid.',
}

export default function Layout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
