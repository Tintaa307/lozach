import BestSellers from "@/components/best-sellers/best-sellers"
import Features from "@/components/features/Features"
import Hero from "@/components/hero/Hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <BestSellers />
    </main>
  )
}
