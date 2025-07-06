"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Reviews() {
  const reviews = [
    {
      name: "Alex Thompson",
      role: "CTO at TechCorp",
      company: "TechCorp",
      rating: 5,
      review:
        "Energent AI has transformed our development process. The API is incredibly fast and the results are consistently impressive.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Maria Garcia",
      role: "Product Manager",
      company: "InnovateLabs",
      rating: 5,
      review:
        "The voice AI integration is seamless. Our customers love the natural conversation experience it provides.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "David Chen",
      role: "Founder",
      company: "StartupXYZ",
      rating: 5,
      review: "Outstanding support and documentation. We were up and running in minutes, not hours.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Sarah Johnson",
      role: "Lead Developer",
      company: "MegaCorp",
      rating: 5,
      review:
        "The multi-provider support is a game-changer. Being able to switch between AI models gives us incredible flexibility.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Brown",
      role: "VP Engineering",
      company: "ScaleUp Inc",
      rating: 5,
      review: "Reliable, fast, and feature-rich. Exactly what we needed for our enterprise-grade applications.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Lisa Wang",
      role: "AI Researcher",
      company: "Research Labs",
      rating: 5,
      review: "The quality of AI responses is exceptional. It has significantly improved our research productivity.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">What Our Users Say</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry leaders are saying about our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">"{review.review}"</p>

              <div className="flex items-center">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <p className="text-sm text-gray-400">{review.role}</p>
                  <p className="text-sm text-blue-400">{review.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
