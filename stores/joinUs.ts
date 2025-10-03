export const useJoinUsStore = defineStore('joinUs', () => {
  const heroData = {
    title: "Bagian dari TEZ Capital",
    backgroundImage: "/img/join-us-hero-bg.jpg"
  }

  const ceoMessage = {
    title: "Pesan dari CEO",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a gravida metus. Pellentesque interdum tristique lacus, vitae ultrices sapien ultrices hendrerit. Quisque diam velit, vestibulum nec risus sit amet, mollis dapibus nunc. Nunc pharetra eget ante quis lacinia. Maecenas blandit, magna vel commodo blandit, nibh purus hendrerit quam, nec interdum leo arcu ac ipsum.

Fusce ullamcorper ornare odio, id rutrum diam dignissim semper. Fusce nec massa sit nunc vulputate faucibus at vitae lectus. Sed interdum hendrerit mi, sit amet tincidunt quam ultrices quis.`,
    image: "/img/profile/1.png",
    name: "Arwin Rasyid",
    position: "CEO & Founder"
  }

  const workSections = [
    {
      id: 1,
      title: "Pembiayaan Modal Kerja",
      description: "Pendanaan Jangka Pendek yang Mendukung Keberlanjutan dan Ekspansi Bisnis",
      icon: "/img/services/1.png",
      color: "#B91C4C"
    },
    {
      id: 2,
      title: "Pembiayaan Investasi",
      description: "Pembiayaan Jangka Menengah untuk Mendukung Investasi Peralatan dan Pertumbuhan Bisnis",
      icon: "/img/services/2.png",
      color: "#B91C4C"
    },
    {
      id: 3,
      title: "Pembiayaan Multiguna",
      description: "Mendukung pembiayaan untuk pembelian produk dan layanan",
      icon: "/img/services/3.png",
      color: "#B91C4C"
    }
  ]

  const teamMembers = [
    {
      id: 1,
      name: "Arwin Rasyid",
      position: "Chairman & Founder",
      image: "/img/team/arwin-rasyid.jpg"
    },
    {
      id: 2,
      name: "Tonny Bako",
      position: "Komisaris Independen",
      image: "/img/team/tonny-bako.jpg"
    },
    {
      id: 3,
      name: "Shiro Sunaga",
      position: "Direktur Utama",
      image: "/img/team/shiro-sunaga.jpg"
    },
    {
      id: 4,
      name: "Yusuke Koizumi",
      position: "Direktur",
      image: "/img/team/yusuke-koizumi.jpg"
    },
    {
      id: 5,
      name: "Daniel",
      position: "Direktur",
      image: "/img/team/daniel.jpg"
    }
  ]

  const workplaceSections = [
    {
      id: 1,
      title: "Working Environment",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
      image: "/img/workplace/working-environment.jpg"
    },
    {
      id: 2,
      title: "Employee Benefits",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
      image: "/img/workplace/employee-benefits.jpg"
    },
    {
      id: 3,
      title: "Life at TEZ Capital",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
      image: "/img/workplace/life-at-tez.jpg",
      highlighted: true
    }
  ]

  const jobPositions = [
    {
      id: 1,
      title: "Procurement Supervisor",
      category: "Procurement",
      department: "Finance",
      location: "Jakarta"
    },
    {
      id: 2,
      title: "Senior Talent Acquisition",
      category: "Talent Acquisition",
      department: "People & Operation",
      location: "Jakarta"
    },
    {
      id: 3,
      title: "Transfer Pricing Assistant",
      category: "Tax",
      department: "Finance",
      location: "Jakarta"
    },
    {
      id: 4,
      title: "Talent Acquisition Senior Manager",
      category: "Talent Acquisition",
      department: "People & Operation",
      location: "Jakarta"
    },
    {
      id: 5,
      title: "Procurement Supervisor",
      category: "Procurement",
      department: "Finance",
      location: "Jakarta"
    },
    {
      id: 6,
      title: "Senior Talent Acquisition",
      category: "Talent Acquisition",
      department: "People & Operation",
      location: "Jakarta"
    },
    {
      id: 7,
      title: "Transfer Pricing Assistant",
      category: "Tax",
      department: "Finance",
      location: "Jakarta"
    }
  ]

  const departmentOptions = [
    { label: "Semua Departemen", value: "" },
    { label: "Finance", value: "Finance" },
    { label: "People & Operation", value: "People & Operation" },
    { label: "Marketing", value: "Marketing" },
    { label: "IT", value: "IT" }
  ]

  const locationOptions = [
    { label: "Semua Lokasi", value: "" },
    { label: "Jakarta", value: "Jakarta" },
    { label: "Surabaya", value: "Surabaya" },
    { label: "Bandung", value: "Bandung" },
    { label: "Medan", value: "Medan" }
  ]

  const searchQuery = ref("")
  const selectedDepartment = ref("")
  const selectedLocation = ref("")

  const filteredJobs = computed(() => {
    let filtered = [...jobPositions]

    if (searchQuery.value) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    if (selectedDepartment.value) {
      filtered = filtered.filter(job => job.department === selectedDepartment.value)
    }

    if (selectedLocation.value) {
      filtered = filtered.filter(job => job.location === selectedLocation.value)
    }

    return filtered
  })

  const footerData = {
    aboutUs: {
      title: "About Us",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Logo Philosophy", href: "/about#logo" },
        { label: "Management Profiles", href: "/about#management" }
      ]
    },
    services: {
      title: "Services",
      links: [
        { label: "Working Capital Financing", href: "/services/working-capital" },
        { label: "Investment Financing", href: "/services/investment" },
        { label: "Multi-Purpose Financing", href: "/services/multi-purpose" },
        { label: "Housing Loan", href: "/services/housing" }
      ]
    },
    newsEvent: {
      title: "News & Event",
      links: [
        { label: "Articles", href: "/news" },
        { label: "Corporate Activity", href: "/news/corporate" },
        { label: "Press Release", href: "/news/press" },
        { label: "Highlights", href: "/news/highlights" }
      ]
    },
    corporate: {
      title: "Corporate",
      links: [
        { label: "Laporan Keuangan", href: "/corporate/financial" },
        { label: "Laporan Tahunan", href: "/corporate/annual" },
        { label: "Laporan Penguduran", href: "/corporate/compliance" },
        { label: "Announcement", href: "/corporate/announcement" }
      ]
    }
  }

  const certifications = [
    {
      name: "OJK",
      logo: "/img/certifications/ojk.png"
    },
    {
      name: "APPI",
      logo: "/img/certifications/appi.png"
    },
    {
      name: "Bank BJB",
      logo: "/img/certifications/bjb.png"
    }
  ]

  return {
    heroData,
    ceoMessage,
    workSections,
    teamMembers,
    workplaceSections,
    jobPositions,
    departmentOptions,
    locationOptions,
    searchQuery,
    selectedDepartment,
    selectedLocation,
    filteredJobs,
    footerData,
    certifications
  }
})