import {
  Hero,
  NewDropSection,
  BestsellerSection,
  CategoryGrid,
  InstagramFeed,
  WhyDudeSection,
} from "@/modules/homepage"
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp"
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/utils/seo"

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      <Hero />
      <CategoryGrid />
      <NewDropSection />
      <BestsellerSection />
      <InstagramFeed />
      <WhyDudeSection />
      <FloatingWhatsApp />
    </>
  )
}
