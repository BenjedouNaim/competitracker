// Types
export type Competitor = {
  id: string
  name: string
  logo: string
  website: string
  category: string
}

export type Product = {
  id: string
  name: string
  category: string
  subcategory: string
  brand: string
  model: string
  image: string
}

export type PriceData = {
  id: string
  productId: string
  competitorId: string
  date: string
  price: number
  discount?: number
  inStock: boolean
}

export type PromotionData = {
  id: string
  competitorId: string
  title: string
  description: string
  startDate: string
  endDate: string
  discountType: "percentage" | "fixed" | "bundle"
  discountValue: number
  category: string
  code?: string
}

export type MarketingStrategy = {
  id: string
  competitorId: string
  channel: "social" | "email" | "seo" | "ads" | "content"
  title: string
  description: string
  startDate: string
  endDate?: string
  targetAudience: string
  estimatedReach: number
  estimatedBudget?: number
  status?: "active" | "planned" | "completed"
  kpis?: {
    name: string
    value: number
    unit: string
    trend: "up" | "down" | "stable"
  }[]
}

export type Alert = {
  id: string
  type: "price" | "promotion" | "stock" | "strategy"
  competitorId: string
  productId?: string
  date: string
  message: string
  severity: "low" | "medium" | "high"
  read: boolean
}

export type PredictionData = {
  id: string
  type: "price" | "sales" | "trend"
  productId?: string
  competitorId?: string
  date: string
  predictedValue: number
  confidence: number
  factors: string[]
}

export type Report = {
  id: string
  title: string
  description: string
  type: "price" | "competitor" | "promotion" | "market" | "custom"
  createdAt: string
  updatedAt: string
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "custom" | "one-time"
  nextSchedule?: string
  format: "pdf" | "excel" | "csv" | "dashboard"
  recipients?: string[]
  status: "scheduled" | "generated" | "sent" | "draft"
}

export type UserSettings = {
  id: string
  name: string
  email: string
  role: "admin" | "analyst" | "viewer"
  notifications: {
    email: boolean
    app: boolean
    slack: boolean
    priceAlerts: boolean
    promotionAlerts: boolean
    stockAlerts: boolean
    strategyAlerts: boolean
    reportGeneration: boolean
  }
  preferences: {
    theme: "light" | "dark" | "system"
    language: "fr" | "en"
    currency: "TND" | "EUR" | "USD"
    dashboardLayout: "compact" | "detailed"
    dataRefreshRate: "realtime" | "hourly" | "daily"
  }
  apiKeys: {
    key: string
    created: string
    lastUsed?: string
    permissions: string[]
  }[]
}

// Mock data
export const competitors: Competitor[] = [
  {
    id: "comp-1",
    name: "Mytek",
    logo: "/placeholder.svg?height=40&width=120",
    website: "https://www.mytek.tn",
    category: "Électronique",
  },
  {
    id: "comp-2",
    name: "Tunisianet",
    logo: "/placeholder.svg?height=40&width=120",
    website: "https://www.tunisianet.com.tn",
    category: "Électronique",
  },
  {
    id: "comp-3",
    name: "Jumia",
    logo: "/placeholder.svg?height=40&width=120",
    website: "https://www.jumia.com.tn",
    category: "E-commerce",
  },
  {
    id: "comp-4",
    name: "Wiki",
    logo: "/placeholder.svg?height=40&width=120",
    website: "https://www.wiki.tn",
    category: "Électronique",
  },
  {
    id: "comp-5",
    name: "Technopro",
    logo: "/placeholder.svg?height=40&width=120",
    website: "https://www.technopro.tn",
    category: "Électronique",
  },
]

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Laptop HP Pavilion 15",
    category: "Informatique",
    subcategory: "Ordinateurs portables",
    brand: "HP",
    model: "Pavilion 15",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "prod-2",
    name: "Smartphone Samsung Galaxy S21",
    category: "Téléphonie",
    subcategory: "Smartphones",
    brand: "Samsung",
    model: "Galaxy S21",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "prod-3",
    name: 'Écran Dell 27"',
    category: "Informatique",
    subcategory: "Écrans",
    brand: "Dell",
    model: "P2719H",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "prod-4",
    name: "Imprimante Canon PIXMA",
    category: "Informatique",
    subcategory: "Imprimantes",
    brand: "Canon",
    model: "PIXMA TS3350",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "prod-5",
    name: "Tablette iPad Air",
    category: "Informatique",
    subcategory: "Tablettes",
    brand: "Apple",
    model: "iPad Air 2022",
    image: "/placeholder.svg?height=200&width=200",
  },
]

// Générer des données de prix historiques pour les 90 derniers jours
export const generatePriceHistory = () => {
  const priceData: PriceData[] = []
  const now = new Date()

  products.forEach((product) => {
    competitors.forEach((competitor) => {
      // Prix de base différent pour chaque concurrent
      let basePrice = 0

      if (product.id === "prod-1") basePrice = 2200 + Math.random() * 300 // Laptop
      if (product.id === "prod-2") basePrice = 2800 + Math.random() * 400 // Smartphone
      if (product.id === "prod-3") basePrice = 800 + Math.random() * 200 // Écran
      if (product.id === "prod-4") basePrice = 300 + Math.random() * 100 // Imprimante
      if (product.id === "prod-5") basePrice = 1800 + Math.random() * 300 // Tablette

      // Ajuster le prix de base selon le concurrent
      if (competitor.id === "comp-1") basePrice *= 1.02 // Mytek légèrement plus cher
      if (competitor.id === "comp-3") basePrice *= 0.97 // Jumia légèrement moins cher

      // Générer des prix pour les 90 derniers jours
      for (let i = 0; i < 90; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Variation aléatoire du prix (+/- 5%)
        const variation = 1 + (Math.random() * 0.1 - 0.05)
        let price = Math.round(basePrice * variation)

        // Ajouter des promotions occasionnelles
        let discount = undefined
        if (Math.random() > 0.85) {
          discount = Math.round(price * (0.05 + Math.random() * 0.15))
          price -= discount
        }

        // Disponibilité en stock (parfois en rupture)
        const inStock = Math.random() > 0.1

        priceData.push({
          id: `price-${product.id}-${competitor.id}-${i}`,
          productId: product.id,
          competitorId: competitor.id,
          date: date.toISOString(),
          price,
          discount,
          inStock,
        })
      }
    })
  })

  return priceData
}

export const priceHistory = generatePriceHistory()

// Promotions
export const promotions: PromotionData[] = [
  {
    id: "promo-1",
    competitorId: "comp-1",
    title: "Soldes d'été",
    description: "Jusqu'à 30% sur les ordinateurs portables",
    startDate: "2023-06-15T00:00:00Z",
    endDate: "2023-07-15T00:00:00Z",
    discountType: "percentage",
    discountValue: 30,
    category: "Informatique",
    code: "SUMMER30",
  },
  {
    id: "promo-2",
    competitorId: "comp-2",
    title: "Back to School",
    description: "Réductions sur tous les produits informatiques",
    startDate: "2023-08-20T00:00:00Z",
    endDate: "2023-09-15T00:00:00Z",
    discountType: "percentage",
    discountValue: 15,
    category: "Informatique",
    code: "SCHOOL15",
  },
  {
    id: "promo-3",
    competitorId: "comp-3",
    title: "Black Friday",
    description: "Offres exceptionnelles sur toutes les catégories",
    startDate: "2023-11-24T00:00:00Z",
    endDate: "2023-11-27T00:00:00Z",
    discountType: "percentage",
    discountValue: 25,
    category: "Tous produits",
  },
  {
    id: "promo-4",
    competitorId: "comp-1",
    title: "Vente Flash Smartphones",
    description: "100 DT de réduction sur les smartphones Samsung",
    startDate: "2023-10-10T00:00:00Z",
    endDate: "2023-10-12T00:00:00Z",
    discountType: "fixed",
    discountValue: 100,
    category: "Téléphonie",
    code: "FLASH100",
  },
  {
    id: "promo-5",
    competitorId: "comp-4",
    title: "Offre de printemps",
    description: "Achetez un écran, obtenez un clavier à moitié prix",
    startDate: "2023-04-01T00:00:00Z",
    endDate: "2023-04-30T00:00:00Z",
    discountType: "bundle",
    discountValue: 50,
    category: "Informatique",
  },
  {
    id: "promo-6",
    competitorId: "comp-2",
    title: "Cyber Monday",
    description: "Jusqu'à 40% sur les accessoires informatiques",
    startDate: "2023-11-27T00:00:00Z",
    endDate: "2023-11-28T00:00:00Z",
    discountType: "percentage",
    discountValue: 40,
    category: "Accessoires",
    code: "CYBER40",
  },
  {
    id: "promo-7",
    competitorId: "comp-5",
    title: "Anniversaire Technopro",
    description: "20% sur tout le site",
    startDate: "2023-05-15T00:00:00Z",
    endDate: "2023-05-22T00:00:00Z",
    discountType: "percentage",
    discountValue: 20,
    category: "Tous produits",
    code: "ANNIV20",
  },
]

// Stratégies marketing
export const marketingStrategies: MarketingStrategy[] = [
  {
    id: "strat-1",
    competitorId: "comp-1",
    channel: "social",
    title: "Campagne Instagram",
    description: "Promotion des nouveaux laptops gaming via des influenceurs",
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-06-30T00:00:00Z",
    targetAudience: "Gamers 18-35 ans",
    estimatedReach: 50000,
    estimatedBudget: 5000,
    status: "completed",
    kpis: [
      { name: "Engagement", value: 12.5, unit: "%", trend: "up" },
      { name: "Clics", value: 15000, unit: "", trend: "up" },
      { name: "Conversions", value: 3.2, unit: "%", trend: "up" },
    ],
  },
  {
    id: "strat-2",
    competitorId: "comp-2",
    channel: "email",
    title: "Newsletter Back to School",
    description: "Série d'emails promotionnels ciblant les étudiants",
    startDate: "2023-08-15T00:00:00Z",
    endDate: "2023-09-15T00:00:00Z",
    targetAudience: "Étudiants",
    estimatedReach: 25000,
    status: "active",
    kpis: [
      { name: "Taux d'ouverture", value: 28.3, unit: "%", trend: "up" },
      { name: "Taux de clic", value: 5.7, unit: "%", trend: "stable" },
      { name: "Désabonnements", value: 0.8, unit: "%", trend: "down" },
    ],
  },
  {
    id: "strat-3",
    competitorId: "comp-3",
    channel: "ads",
    title: "Campagne Google Ads",
    description: "Annonces ciblées sur les termes de recherche liés aux smartphones",
    startDate: "2023-07-01T00:00:00Z",
    targetAudience: "Acheteurs de smartphones",
    estimatedReach: 100000,
    estimatedBudget: 10000,
    status: "active",
    kpis: [
      { name: "CTR", value: 3.8, unit: "%", trend: "up" },
      { name: "CPC", value: 0.45, unit: "DT", trend: "down" },
      { name: "Conversions", value: 2.1, unit: "%", trend: "up" },
    ],
  },
  {
    id: "strat-4",
    competitorId: "comp-1",
    channel: "content",
    title: "Blog Tech",
    description: "Série d'articles sur les dernières technologies",
    startDate: "2023-01-01T00:00:00Z",
    targetAudience: "Passionnés de technologie",
    estimatedReach: 15000,
    status: "active",
    kpis: [
      { name: "Temps moyen", value: 3.5, unit: "min", trend: "up" },
      { name: "Pages/session", value: 2.3, unit: "", trend: "up" },
      { name: "Taux de rebond", value: 45, unit: "%", trend: "down" },
    ],
  },
  {
    id: "strat-5",
    competitorId: "comp-4",
    channel: "seo",
    title: "Optimisation SEO",
    description: "Refonte du site pour améliorer le référencement",
    startDate: "2023-03-01T00:00:00Z",
    endDate: "2023-06-01T00:00:00Z",
    targetAudience: "Tous visiteurs",
    estimatedReach: 200000,
    estimatedBudget: 8000,
    status: "completed",
    kpis: [
      { name: "Position moyenne", value: 3.2, unit: "", trend: "up" },
      { name: "Trafic organique", value: 35, unit: "%", trend: "up" },
      { name: "Mots-clés classés", value: 120, unit: "", trend: "up" },
    ],
  },
  {
    id: "strat-6",
    competitorId: "comp-5",
    channel: "social",
    title: "Campagne Facebook",
    description: "Promotion des produits phares avec des publicités ciblées",
    startDate: "2023-05-15T00:00:00Z",
    endDate: "2023-06-15T00:00:00Z",
    targetAudience: "Adultes 25-45 ans",
    estimatedReach: 75000,
    estimatedBudget: 6000,
    status: "completed",
    kpis: [
      { name: "Engagement", value: 8.7, unit: "%", trend: "stable" },
      { name: "Coût par clic", value: 0.32, unit: "DT", trend: "down" },
      { name: "ROI", value: 320, unit: "%", trend: "up" },
    ],
  },
  {
    id: "strat-7",
    competitorId: "comp-2",
    channel: "ads",
    title: "Campagne Display",
    description: "Bannières publicitaires sur les sites partenaires",
    startDate: "2023-09-01T00:00:00Z",
    endDate: "2023-10-01T00:00:00Z",
    targetAudience: "Professionnels",
    estimatedReach: 50000,
    estimatedBudget: 4500,
    status: "planned",
    kpis: [],
  },
  {
    id: "strat-8",
    competitorId: "comp-3",
    channel: "content",
    title: "Vidéos tutoriels",
    description: "Série de vidéos explicatives sur l'utilisation des produits",
    startDate: "2023-07-15T00:00:00Z",
    targetAudience: "Clients existants",
    estimatedReach: 30000,
    status: "active",
    kpis: [
      { name: "Vues", value: 25000, unit: "", trend: "up" },
      { name: "Durée moyenne", value: 4.2, unit: "min", trend: "up" },
      { name: "Partages", value: 850, unit: "", trend: "up" },
    ],
  },
]

// Alertes
export const alerts: Alert[] = [
  {
    id: "alert-1",
    type: "price",
    competitorId: "comp-2",
    productId: "prod-2",
    date: "2023-06-10T09:15:00Z",
    message: "Tunisianet a baissé le prix du Samsung Galaxy S21 de 15%",
    severity: "high",
    read: false,
  },
  {
    id: "alert-2",
    type: "promotion",
    competitorId: "comp-1",
    date: "2023-06-08T14:30:00Z",
    message: "Mytek a lancé une nouvelle promotion sur les ordinateurs portables",
    severity: "medium",
    read: true,
  },
  {
    id: "alert-3",
    type: "stock",
    competitorId: "comp-3",
    productId: "prod-5",
    date: "2023-06-09T11:45:00Z",
    message: "iPad Air en rupture de stock chez Jumia",
    severity: "low",
    read: false,
  },
  {
    id: "alert-4",
    type: "strategy",
    competitorId: "comp-2",
    date: "2023-06-07T16:20:00Z",
    message: "Tunisianet a lancé une nouvelle campagne publicitaire sur Facebook",
    severity: "medium",
    read: false,
  },
  {
    id: "alert-5",
    type: "price",
    competitorId: "comp-4",
    productId: "prod-3",
    date: "2023-06-06T10:05:00Z",
    message: "Wiki a augmenté le prix de l'écran Dell de 8%",
    severity: "medium",
    read: true,
  },
]

// Prédictions
export const predictions: PredictionData[] = [
  {
    id: "pred-1",
    type: "price",
    productId: "prod-1",
    competitorId: "comp-1",
    date: "2023-07-01T00:00:00Z",
    predictedValue: 2150,
    confidence: 0.85,
    factors: ["Tendance historique", "Saisonnalité", "Promotion récente"],
  },
  {
    id: "pred-2",
    type: "price",
    productId: "prod-2",
    competitorId: "comp-2",
    date: "2023-07-01T00:00:00Z",
    predictedValue: 2650,
    confidence: 0.78,
    factors: ["Nouveau modèle annoncé", "Stock disponible", "Concurrence"],
  },
  {
    id: "pred-3",
    type: "sales",
    productId: "prod-3",
    date: "2023-07-01T00:00:00Z",
    predictedValue: 120,
    confidence: 0.72,
    factors: ["Tendance du marché", "Saisonnalité", "Promotions concurrentes"],
  },
  {
    id: "pred-4",
    type: "trend",
    date: "2023-07-01T00:00:00Z",
    predictedValue: 15,
    confidence: 0.65,
    factors: ["Recherches Google", "Mentions sur les réseaux sociaux", "Tendances du secteur"],
  },
  {
    id: "pred-5",
    type: "price",
    productId: "prod-5",
    competitorId: "comp-3",
    date: "2023-07-01T00:00:00Z",
    predictedValue: 1750,
    confidence: 0.81,
    factors: ["Historique des prix", "Stratégie de l'entreprise", "Événements à venir"],
  },
]

// Rapports
export const reports: Report[] = [
  {
    id: "report-1",
    title: "Analyse comparative des prix",
    description: "Comparaison détaillée des prix entre tous les concurrents par catégorie de produit",
    type: "price",
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
    frequency: "monthly",
    nextSchedule: "2023-07-01T10:00:00Z",
    format: "pdf",
    recipients: ["marketing@example.com", "direction@example.com"],
    status: "sent",
  },
  {
    id: "report-2",
    title: "Suivi des promotions concurrentes",
    description: "Analyse des promotions récentes et de leur impact sur le marché",
    type: "promotion",
    createdAt: "2023-06-15T14:30:00Z",
    updatedAt: "2023-06-15T14:30:00Z",
    frequency: "weekly",
    nextSchedule: "2023-06-22T14:30:00Z",
    format: "excel",
    recipients: ["marketing@example.com"],
    status: "scheduled",
  },
  {
    id: "report-3",
    title: "Profil complet de concurrent",
    description: "Analyse approfondie de la stratégie et du positionnement de Tunisianet",
    type: "competitor",
    createdAt: "2023-05-20T09:15:00Z",
    updatedAt: "2023-05-20T09:15:00Z",
    frequency: "quarterly",
    nextSchedule: "2023-08-20T09:15:00Z",
    format: "pdf",
    recipients: ["direction@example.com", "strategie@example.com"],
    status: "sent",
  },
  {
    id: "report-4",
    title: "Tendances du marché",
    description: "Analyse des tendances émergentes et des opportunités du marché",
    type: "market",
    createdAt: "2023-06-10T11:00:00Z",
    updatedAt: "2023-06-10T11:00:00Z",
    frequency: "monthly",
    nextSchedule: "2023-07-10T11:00:00Z",
    format: "dashboard",
    status: "generated",
  },
  {
    id: "report-5",
    title: "Rapport personnalisé - Smartphones",
    description: "Analyse détaillée du segment des smartphones haut de gamme",
    type: "custom",
    createdAt: "2023-06-05T16:45:00Z",
    updatedAt: "2023-06-05T16:45:00Z",
    frequency: "one-time",
    format: "pdf",
    recipients: ["produits@example.com"],
    status: "sent",
  },
  {
    id: "report-6",
    title: "Alertes de prix hebdomadaires",
    description: "Récapitulatif des changements de prix significatifs de la semaine",
    type: "price",
    createdAt: "2023-06-18T08:00:00Z",
    updatedAt: "2023-06-18T08:00:00Z",
    frequency: "weekly",
    nextSchedule: "2023-06-25T08:00:00Z",
    format: "excel",
    recipients: ["ventes@example.com", "marketing@example.com"],
    status: "scheduled",
  },
  {
    id: "report-7",
    title: "Performance des promotions",
    description: "Analyse de l'efficacité des promotions par rapport à la concurrence",
    type: "promotion",
    createdAt: "2023-05-30T13:20:00Z",
    updatedAt: "2023-05-30T13:20:00Z",
    frequency: "monthly",
    nextSchedule: "2023-06-30T13:20:00Z",
    format: "dashboard",
    status: "draft",
  },
]

// Paramètres utilisateur
export const userSettings: UserSettings = {
  id: "user-1",
  name: "Ahmed Ben Ali",
  email: "ahmed.benali@example.com",
  role: "admin",
  notifications: {
    email: true,
    app: true,
    slack: false,
    priceAlerts: true,
    promotionAlerts: true,
    stockAlerts: false,
    strategyAlerts: true,
    reportGeneration: true,
  },
  preferences: {
    theme: "system",
    language: "fr",
    currency: "TND",
    dashboardLayout: "detailed",
    dataRefreshRate: "hourly",
  },
  apiKeys: [
    {
      key: "ct_api_123456789abcdef",
      created: "2023-05-01T10:00:00Z",
      lastUsed: "2023-06-15T14:30:00Z",
      permissions: ["read", "write"],
    },
    {
      key: "ct_api_987654321fedcba",
      created: "2023-06-10T09:15:00Z",
      permissions: ["read"],
    },
  ],
}

// Statistiques pour le tableau de bord
export const dashboardStats = {
  totalCompetitors: competitors.length,
  totalProductsTracked: products.length,
  averagePriceChange: -2.7,
  activePromotions: 4,
  alertsToday: 3,
  marketShareData: [
    { name: "Mytek", value: 35 },
    { name: "Tunisianet", value: 30 },
    { name: "Jumia", value: 20 },
    { name: "Wiki", value: 10 },
    { name: "Technopro", value: 5 },
  ],
  priceIndexByCategory: [
    { category: "Ordinateurs portables", mytek: 100, tunisianet: 98, jumia: 95, wiki: 102, technopro: 103 },
    { category: "Smartphones", mytek: 100, tunisianet: 102, jumia: 97, wiki: 101, technopro: 104 },
    { category: "Écrans", mytek: 100, tunisianet: 99, jumia: 96, wiki: 98, technopro: 101 },
    { category: "Imprimantes", mytek: 100, tunisianet: 97, jumia: 94, wiki: 99, technopro: 102 },
    { category: "Tablettes", mytek: 100, tunisianet: 101, jumia: 98, wiki: 103, technopro: 105 },
  ],
  recentPriceChanges: [
    { product: "Samsung Galaxy S21", competitor: "Tunisianet", change: -15, date: "2023-06-10" },
    { product: 'Écran Dell 27"', competitor: "Wiki", change: 8, date: "2023-06-06" },
    { product: "Laptop HP Pavilion 15", competitor: "Mytek", change: -10, date: "2023-06-05" },
    { product: "iPad Air", competitor: "Jumia", change: -5, date: "2023-06-04" },
    { product: "Imprimante Canon PIXMA", competitor: "Technopro", change: 3, date: "2023-06-03" },
  ],
}

// Fonction utilitaire pour obtenir les données de prix d'un produit
export const getPriceDataForProduct = (productId: string) => {
  return priceHistory.filter((item) => item.productId === productId)
}

// Fonction utilitaire pour obtenir les données de prix d'un concurrent
export const getPriceDataForCompetitor = (competitorId: string) => {
  return priceHistory.filter((item) => item.competitorId === competitorId)
}

// Fonction utilitaire pour obtenir les promotions d'un concurrent
export const getPromotionsForCompetitor = (competitorId: string) => {
  return promotions.filter((item) => item.competitorId === competitorId)
}

// Fonction utilitaire pour obtenir les stratégies marketing d'un concurrent
export const getMarketingStrategiesForCompetitor = (competitorId: string) => {
  return marketingStrategies.filter((item) => item.competitorId === competitorId)
}

// Fonction utilitaire pour obtenir les rapports par type
export const getReportsByType = (type: string) => {
  return type === "all" ? reports : reports.filter((report) => report.type === type)
}

// Fonction utilitaire pour obtenir les rapports par statut
export const getReportsByStatus = (status: string) => {
  return status === "all" ? reports : reports.filter((report) => report.status === status)
}
