// About Page Data
export interface AboutData {
  our_story?: {
    title: string
    content: string
    image?: string
  }
  vision?: {
    title: string
    content: string
  }
  mission?: {
    title: string
    items: string[]
  }
  fast_values?: {
    title: string
    subtitle: string
    items: Array<{
      title: string
      description: string
      icon: string
    }>
  }
  idc_values?: {
    title: string
    subtitle: string
    items: Array<{
      title: string
      description: string
      icon: string
    }>
  }
  logo_philosophy?: {
    title: string
    image: string
    points: string[]
    description?: string
  }
  closing_statement?: string
}

// Homepage Data
export interface HomepageData {
  hero?: {
    title: string
    description: string
    images: string[]
  }
  sixReasons?: Array<{
    title: string
    description: string
    image: string
  }>
  services?: Array<{
    id: number
    title: string
    description: string
    fullDescription: string
    image: string
    features: Array<{
      label: string
      description: string
    }>
  }>
  applicationProcess?: Array<{
    step: number
    title: string
    image: string
  }>
  partners?: Array<{
    name: string
    image: string
    alt: string
  }>
  faq?: Array<{
    id: number
    question: string
    answer: string
  }>
}

// News Data
export interface NewsItem {
  id: number
  type: string
  category: string
  slug: string
  title_id: string
  title_en?: string
  excerpt_id: string
  excerpt_en?: string
  content_id?: string
  content_en?: string
  featured_image?: string
  featured_image_url?: string
  author?: string
  published_at: string
  is_featured: boolean
  is_published: boolean
  status: string
  view_count: number
  start_date?: string
  end_date?: string
  location_id?: string
  location_en?: string
  source_url?: string
  created_at: string
  updated_at: string
}

export interface NewsResponse {
  success: boolean
  message: string
  data: {
    current_page: number
    data: NewsItem[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  categories: Record<string, string>
  response_time_ms: number
}

// Services Data
export interface ServiceItem {
  id: number
  type: string
  category: string
  slug: string
  title_id: string
  title_en?: string
  excerpt_id: string
  excerpt_en?: string
  content_id?: string
  content_en?: string
  featured_image?: string
  featured_image_url?: string
  gallery?: string
  gallery_urls?: string[]
  // New service-specific fields
  interest_list?: { name: string; rate: number }[]
  interest_list_array?: { name: string; rate: number }[]
  document_list?: string[]
  document_list_array?: string[]
  fees_list?: { name: string; type: string; value: number }[]
  fees_list_array?: { name: string; type: string; value: number }[]
  interest_rate?: number
  service_duration?: string
  requirements_id?: string
  requirements_en?: string
  benefits_id?: string
  benefits_en?: string
  // Existing fields
  tags?: string
  tags_array?: string[]
  author?: string
  source_url?: string
  is_published: boolean
  published_at: string
  is_featured: boolean
  show_credit_simulation: boolean
  status: string
  meta_title_id?: string
  meta_title_en?: string
  meta_description_id?: string
  meta_description_en?: string
  sort_order: number
  view_count: number
  like_count: number
  share_count: number
  created_at: string
  updated_at: string
}

export interface ServicesResponse {
  success: boolean
  message: string
  data: {
    current_page: number
    data: ServiceItem[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  categories: Record<string, string>
  response_time_ms: number
}

export interface ServiceDetailResponse {
  success: boolean
  message: string
  data: ServiceItem
  categories: Record<string, string>
  response_time_ms: number
}

export interface ServicesData {
  services: ServiceItem[]
  categories?: Record<string, string>
}

// Contact Data
export interface ContactData {
  office?: {
    name: string
    address: string
    phone: string
    email?: string
  }
  services?: Array<{
    title: string
    image: string
  }>
  faq?: Array<{
    id: number
    question: string
    answer: string
  }>
}

// Corporate Data
export interface CorporateData {
  financialReports?: Array<{
    id: number
    title: string
    year: number
    file: string
    publishedAt: string
  }>
  annualReports?: Array<{
    id: number
    title: string
    year: number
    file: string
    publishedAt: string
  }>
  announcements?: Array<{
    id: number
    title: string
    content: string
    publishedAt: string
  }>
  complaintReport?: {
    title: string
    content: string
    file?: string
  }
}


// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Error response
export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}