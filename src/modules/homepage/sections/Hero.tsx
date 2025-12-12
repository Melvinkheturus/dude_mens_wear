import { getBanners } from "@/lib/demo-data"
import HeroClient from "./HeroClient"

export default function Hero() {
  const banners = getBanners()
  
  if (banners.length === 0) {
    return null
  }
  
  return <HeroClient banners={banners} />
}
