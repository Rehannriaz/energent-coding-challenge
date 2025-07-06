"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Github } from "lucide-react"

export function Team() {
  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former Google AI researcher with 10+ years in machine learning and enterprise solutions.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-founder",
      bio: "Ex-Tesla engineer specializing in autonomous systems and real-time AI processing.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Dr. Aisha Patel",
      role: "Head of AI Research",
      bio: "PhD in Computer Science from MIT, published researcher in neural networks and NLP.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "James Kim",
      role: "VP of Engineering",
      bio: "Former Microsoft architect with expertise in scalable cloud infrastructure.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#161616] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Meet Our Team</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The brilliant minds behind our revolutionary AI platform, bringing decades of combined experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card
              key={index}
              className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="relative mb-6">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              </div>

              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-blue-400 font-medium mb-4">{member.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{member.bio}</p>

              <div className="flex gap-3">
                <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
