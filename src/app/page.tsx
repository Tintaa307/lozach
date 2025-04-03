import AuthorRecommendations from "@/components/author-recommendations/author-recommendations"
import BestSellers from "@/components/best-sellers/best-sellers"
import CatagoriesSection from "@/components/categories-section/categories-section"
import Features from "@/components/features/Features"
import Hero from "@/components/hero/Hero"
import Newsletter from "@/components/newsletter/Newsletter"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      {/* <Features /> */}
      <BestSellers />
      <AuthorRecommendations />
      <Newsletter />
      <CatagoriesSection />
    </main>
  )
}
