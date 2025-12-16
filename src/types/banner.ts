// Banner type based on database schema
export interface Banner {
    id: string
    title: string
    image_url: string
    link_url: string | null
    is_active: boolean | null
    placement: string | null
    created_at: string | null
    updated_at: string | null
}

// Alias for compatibility with existing components
export type { Banner as DemoBanner }
