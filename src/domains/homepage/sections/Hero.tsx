import { getBanners } from "@/server/banners/get"
import HeroClient from "./HeroClient"

export default async function Hero() {
  const result = await getBanners()
  const banners = result.data || []

  if (banners.length === 0) {
    return null
  }

  return <HeroClient banners={banners} />
}

