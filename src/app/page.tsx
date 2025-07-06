import { HeroSection } from "@/components/sections/hero-section"
import { AIIntegrationHub } from "@/components/sections/ai-integration-hub"
import { CoreFeatures } from "@/components/sections/core-features"
import { Applications } from "@/components/sections/applications"
import { Statistics } from "@/components/sections/statistics"
import { Team } from "@/components/sections/team"
import { Subscriptions } from "@/components/sections/subscriptions"
import { Reviews } from "@/components/sections/reviews"
import { FAQ } from "@/components/sections/faq"
import { Contact } from "@/components/sections/contact"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <HeroSection />
      <AIIntegrationHub />
      <CoreFeatures />
      <Applications />
      <Statistics />
      <Team />
      <Subscriptions />
      <Reviews />
      <FAQ />
      <Contact />
    </main>
  )
}
