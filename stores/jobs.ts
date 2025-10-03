export interface JobListing {
  id: number
  title: string
  category: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  posted_date: string
  deadline: string
  experience_level: 'entry' | 'mid' | 'senior'
}

export interface Department {
  id: string
  name: string
  description?: string
}

export interface Location {
  id: string
  name: string
  city: string
}

export const useJobsStore = defineStore('jobs', () => {
  // Static data for job listings
  const departments: Department[] = [
    { id: 'finance', name: 'Finance', description: 'Financial planning and analysis' },
    { id: 'people-operation', name: 'People & Operation', description: 'Human resources and operations' },
    { id: 'technology', name: 'Technology', description: 'IT and software development' },
    { id: 'marketing', name: 'Marketing', description: 'Brand and digital marketing' },
    { id: 'sales', name: 'Sales', description: 'Business development and sales' },
    { id: 'procurement', name: 'Procurement', description: 'Procurement and supply chain' },
    { id: 'talent-acquisition', name: 'Talent Acquisition', description: 'Recruitment and talent management' },
    { id: 'tax', name: 'Tax', description: 'Tax compliance and planning' }
  ]

  const locations: Location[] = [
    { id: 'jakarta', name: 'Jakarta', city: 'Jakarta' },
    { id: 'surabaya', name: 'Surabaya', city: 'Surabaya' },
    { id: 'bandung', name: 'Bandung', city: 'Bandung' },
    { id: 'medan', name: 'Medan', city: 'Medan' },
    { id: 'yogyakarta', name: 'Yogyakarta', city: 'Yogyakarta' }
  ]

  const jobListings: JobListing[] = [
    {
      id: 1,
      title: 'Procurement Supervisor',
      category: 'Procurement',
      department: 'Finance',
      location: 'Jakarta',
      type: 'full-time',
      description: 'We are looking for an experienced Procurement Supervisor to join our team. The ideal candidate will oversee procurement activities and ensure cost-effective purchasing decisions.',
      requirements: [
        'Bachelor\'s degree in Business Administration, Supply Chain Management, or related field',
        'Minimum 3-5 years of experience in procurement or supply chain management',
        'Strong negotiation and analytical skills',
        'Proficiency in MS Office Suite and procurement software',
        'Excellent communication and leadership skills',
        'Knowledge of procurement regulations and best practices'
      ],
      responsibilities: [
        'Oversee daily procurement operations and activities',
        'Develop and implement procurement strategies and policies',
        'Manage supplier relationships and evaluate vendor performance',
        'Negotiate contracts and pricing with suppliers',
        'Monitor procurement budgets and ensure cost-effectiveness',
        'Lead and supervise procurement team members',
        'Ensure compliance with company policies and regulations',
        'Prepare procurement reports and analysis'
      ],
      benefits: [
        'Competitive salary and performance bonuses',
        'Comprehensive health insurance',
        'Professional development opportunities',
        'Flexible working arrangements',
        'Annual leave and sick leave',
        'Employee wellness programs'
      ],
      posted_date: '2024-09-15',
      deadline: '2024-10-15',
      experience_level: 'mid'
    },
    {
      id: 2,
      title: 'Senior Talent Acquisition',
      category: 'Talent Acquisition',
      department: 'People & Operation',
      location: 'Jakarta',
      type: 'full-time',
      description: 'Join our People & Operation team as a Senior Talent Acquisition specialist. You will be responsible for attracting, recruiting, and retaining top talent for our organization.',
      requirements: [
        'Bachelor\'s degree in Human Resources, Psychology, or related field',
        'Minimum 5-7 years of experience in talent acquisition or recruitment',
        'Strong understanding of recruitment best practices and techniques',
        'Experience with applicant tracking systems (ATS)',
        'Excellent interpersonal and communication skills',
        'Knowledge of employment laws and regulations',
        'Ability to work in fast-paced environment'
      ],
      responsibilities: [
        'Develop and execute comprehensive recruitment strategies',
        'Source, screen, and interview candidates for various positions',
        'Build and maintain talent pipelines for critical roles',
        'Collaborate with hiring managers to understand staffing needs',
        'Manage the full recruitment lifecycle from job posting to onboarding',
        'Enhance employer branding and recruitment marketing',
        'Analyze recruitment metrics and provide insights',
        'Stay updated on industry trends and best practices'
      ],
      benefits: [
        'Competitive salary package',
        'Health and dental insurance',
        'Learning and development budget',
        'Remote work flexibility',
        'Performance-based incentives',
        'Career advancement opportunities'
      ],
      posted_date: '2024-09-20',
      deadline: '2024-10-20',
      experience_level: 'senior'
    },
    {
      id: 3,
      title: 'Transfer Pricing Assistant',
      category: 'Tax',
      department: 'Finance',
      location: 'Jakarta',
      type: 'full-time',
      description: 'We are seeking a detail-oriented Transfer Pricing Assistant to support our tax compliance and transfer pricing documentation activities.',
      requirements: [
        'Bachelor\'s degree in Accounting, Finance, Tax, or related field',
        'Fresh graduate or 1-2 years of experience in tax or accounting',
        'Knowledge of transfer pricing regulations and documentation',
        'Strong analytical and research skills',
        'Proficiency in Excel and accounting software',
        'Good command of English and Bahasa Indonesia',
        'CPA or tax certification is a plus'
      ],
      responsibilities: [
        'Assist in preparation of transfer pricing documentation',
        'Support transfer pricing studies and analysis',
        'Maintain transfer pricing databases and records',
        'Assist in tax compliance and reporting activities',
        'Research tax regulations and transfer pricing guidelines',
        'Support senior staff in client engagements',
        'Prepare working papers and documentation',
        'Assist in administrative tasks and file management'
      ],
      benefits: [
        'Competitive entry-level salary',
        'Comprehensive training program',
        'Health insurance coverage',
        'Professional certification support',
        'Mentorship opportunities',
        'Career growth pathway'
      ],
      posted_date: '2024-09-25',
      deadline: '2024-10-25',
      experience_level: 'entry'
    },
    {
      id: 4,
      title: 'Talent Acquisition Senior Manager',
      category: 'Talent Acquisition',
      department: 'People & Operation',
      location: 'Jakarta',
      type: 'full-time',
      description: 'Lead our talent acquisition function as a Senior Manager. You will be responsible for developing recruitment strategies and building a high-performing talent acquisition team.',
      requirements: [
        'Bachelor\'s or Master\'s degree in Human Resources or related field',
        'Minimum 8-10 years of experience in talent acquisition with leadership role',
        'Proven track record in building and leading recruitment teams',
        'Strategic thinking and business acumen',
        'Experience with talent acquisition technology and tools',
        'Strong leadership and people management skills',
        'Excellent stakeholder management abilities'
      ],
      responsibilities: [
        'Lead and manage the talent acquisition team',
        'Develop and implement talent acquisition strategies aligned with business goals',
        'Partner with senior leadership on workforce planning',
        'Oversee recruitment processes and ensure quality hiring',
        'Drive employer branding and talent marketing initiatives',
        'Manage recruitment budgets and vendor relationships',
        'Establish recruitment metrics and KPIs',
        'Ensure compliance with employment regulations'
      ],
      benefits: [
        'Executive compensation package',
        'Stock options or equity participation',
        'Executive health benefits',
        'Leadership development programs',
        'Flexible work arrangements',
        'International assignment opportunities'
      ],
      posted_date: '2024-09-10',
      deadline: '2024-10-10',
      experience_level: 'senior'
    }
  ]

  // Company information
  const companyInfo = {
    name: 'PT TEZ Capital and Finance',
    tagline: 'Bagian dari TEZ Capital',
    hero_title: 'Cari Lowongan yang Sesuai Denganmu',
    description: 'Bergabunglah dengan tim kami dan kembangkan karir Anda di perusahaan pembiayaan terkemuka Indonesia.',
    why_join: [
      {
        title: 'Working Capital Financing',
        description: 'Short-Term Funding that Supports Business Sustainability and Expansion',
        icon: 'mdi:chart-line'
      },
      {
        title: 'Investment Financing',
        description: 'Mid-Term Financing to Support Equipment Investment and Business Growth',
        icon: 'mdi:factory'
      },
      {
        title: 'Multi-Purpose Financing',
        description: 'Supports financing for the purchase of products and services',
        icon: 'mdi:trending-up'
      }
    ],
    team_members: [
      {
        id: 1,
        name: 'Arwin Rasyid',
        position: 'President & Founder',
        image: '/img/team/arwin.jpg'
      },
      {
        id: 2,
        name: 'Tomy Bako',
        position: 'Finance Director',
        image: '/img/team/tomy.jpg'
      },
      {
        id: 3,
        name: 'Shiro Sunaga',
        position: 'Operation Director',
        image: '/img/team/shiro.jpg'
      },
      {
        id: 4,
        name: 'Yusuke Koizumi',
        position: 'Technology Director',
        image: '/img/team/yusuke.jpg'
      }
    ],
    workplace_highlights: [
      {
        title: 'Working Environment',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare velit ex non eros tempus, at euismod nibh ultricies lacus elit',
        image: '/img/workplace/environment.jpg'
      },
      {
        title: 'Employee Benefits',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare velit ex non eros tempus, at euismod nibh ultricies lacus elit',
        image: '/img/workplace/benefits.jpg'
      },
      {
        title: 'Life at TEZ Capital',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare velit ex non eros tempus, at euismod nibh ultricies lacus elit',
        image: '/img/workplace/life.jpg'
      }
    ]
  }

  // Reactive state
  const selectedDepartment = ref<string>('all')
  const selectedLocation = ref<string>('all')
  const searchQuery = ref<string>('')

  // Computed properties
  const filteredJobs = computed(() => {
    let filtered = jobListings

    if (selectedDepartment.value !== 'all') {
      filtered = filtered.filter(job => job.department === selectedDepartment.value)
    }

    if (selectedLocation.value !== 'all') {
      filtered = filtered.filter(job => job.location === selectedLocation.value)
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  const getJobById = (id: number) => {
    return jobListings.find(job => job.id === id)
  }

  const getDepartmentName = (id: string) => {
    const dept = departments.find(d => d.id === id)
    return dept?.name || id
  }

  const getLocationName = (id: string) => {
    const loc = locations.find(l => l.id === id)
    return loc?.name || id
  }

  // Actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setDepartmentFilter = (department: string) => {
    selectedDepartment.value = department
  }

  const setLocationFilter = (location: string) => {
    selectedLocation.value = location
  }

  const clearFilters = () => {
    selectedDepartment.value = 'all'
    selectedLocation.value = 'all'
    searchQuery.value = ''
  }

  return {
    // Data
    departments,
    locations,
    jobListings,
    companyInfo,
    
    // State
    selectedDepartment: readonly(selectedDepartment),
    selectedLocation: readonly(selectedLocation),
    searchQuery: readonly(searchQuery),
    
    // Computed
    filteredJobs,
    
    // Actions
    getJobById,
    getDepartmentName,
    getLocationName,
    setSearchQuery,
    setDepartmentFilter,
    setLocationFilter,
    clearFilters
  }
})