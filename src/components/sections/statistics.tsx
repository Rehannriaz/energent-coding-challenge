"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export function Statistics() {
  const [counts, setCounts] = useState({
    users: 0,
    requests: 0,
    uptime: 0,
    countries: 0,
  })

  const finalCounts = {
    users: 2500000,
    requests: 50000000,
    uptime: 99.9,
    countries: 150,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setCounts({
        users: Math.floor(finalCounts.users * easeOutQuart),
        requests: Math.floor(finalCounts.requests * easeOutQuart),
        uptime: Math.min(finalCounts.uptime, finalCounts.uptime * easeOutQuart),
        countries: Math.floor(finalCounts.countries * easeOutQuart),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts(finalCounts)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      number: counts.users.toLocaleString() + "+",
      label: "Active Users",
      description: "Developers and businesses trust our platform",
    },
    {
      number: counts.requests.toLocaleString() + "+",
      label: "API Requests",
      description: "Processed monthly across all services",
    },
    {
      number: counts.uptime.toFixed(1) + "%",
      label: "Uptime",
      description: "Guaranteed service availability",
    },
    {
      number: counts.countries + "+",
      label: "Countries",
      description: "Global presence and support",
    },
  ]

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Our Statistics</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Numbers that speak to our commitment to excellence and the trust our users place in us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-4">{stat.number}</div>
              <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
