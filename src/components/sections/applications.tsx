"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building, ShoppingCart, Heart, GraduationCap, Car, Home } from "lucide-react"

export function Applications() {
  const applications = [
    {
      icon: Building,
      title: "Enterprise Solutions",
      description: "Streamline operations with intelligent automation and decision-making systems.",
      features: ["Process Automation", "Predictive Analytics", "Risk Management"],
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Intelligence",
      description: "Boost sales with personalized recommendations and inventory optimization.",
      features: ["Product Recommendations", "Price Optimization", "Customer Insights"],
      color: "from-green-500/20 to-green-600/20",
    },
    {
      icon: Heart,
      title: "Healthcare AI",
      description: "Improve patient outcomes with diagnostic assistance and treatment planning.",
      features: ["Medical Imaging", "Drug Discovery", "Patient Monitoring"],
      color: "from-red-500/20 to-red-600/20",
    },
    {
      icon: GraduationCap,
      title: "Education Technology",
      description: "Personalize learning experiences with adaptive AI tutoring systems.",
      features: ["Adaptive Learning", "Performance Analytics", "Content Generation"],
      color: "from-purple-500/20 to-purple-600/20",
    },
    {
      icon: Car,
      title: "Automotive Intelligence",
      description: "Enhance vehicle safety and efficiency with autonomous driving systems.",
      features: ["Autonomous Navigation", "Predictive Maintenance", "Traffic Optimization"],
      color: "from-orange-500/20 to-orange-600/20",
    },
    {
      icon: Home,
      title: "Smart Home Solutions",
      description: "Create intelligent living spaces with IoT integration and automation.",
      features: ["Home Automation", "Energy Optimization", "Security Systems"],
      color: "from-teal-500/20 to-teal-600/20",
    },
  ]

  return (
    <section id="applications" className="py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Applications</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore how our AI solutions transform industries and create new possibilities across various sectors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <Card
              key={index}
              className={`p-8 bg-gradient-to-br ${app.color} border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4">
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{app.title}</h3>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">{app.description}</p>

              <div className="space-y-2 mb-6">
                {app.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3" />
                    {feature}
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full justify-between group-hover:bg-white/10 transition-colors">
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
