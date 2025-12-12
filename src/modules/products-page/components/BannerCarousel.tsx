"use client"

import { useEffect, useState } from "react"
import { getBanners, type DemoBanner } from "@/lib/demo-data"
import BannerCarouselClient from "./BannerCarouselClient"

export default function BannerCarousel() {
  const [banners, setBanners] = useState<DemoBanner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBanners() {
      try {
        const data = getBanners()
        setBanners(data)
      } catch (error) {
        console.error("Failed to fetch banners:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBanners()
  }, [])

  if (isLoading) {
    return (
      <section className="w-full bg-white px-4 py-4 md:px-8">
        <div className="relative mx-auto max-w-[1920px] overflow-hidden rounded-2xl shadow-xl md:rounded-3xl bg-gray-100 aspect-video md:h-[400px] md:aspect-auto flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return null
  }

  return <BannerCarouselClient banners={banners} />
}
