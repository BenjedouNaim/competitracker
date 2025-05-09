"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  competitors,
  products,
  priceHistory,
  getPromotionsForCompetitor,
  getMarketingStrategiesForCompetitor,
} from "@/lib/mock-data"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowUpRight, ExternalLink, Loader, Tag, Target, TrendingUp } from "lucide-react"
import Image from "next/image"
import { getCompetitors } from "@/actions/analyseConcurrentielle"
import { toast } from "@/hooks/use-toast"


export default function CompetitorAnalysis() {
  const [competitors,setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompetitor, setSelectedCompetitor] = useState("");

  const competitor = competitors.find((c) => c.id === selectedCompetitor)
  const competitorPromotions = getPromotionsForCompetitor(selectedCompetitor)
  const competitorStrategies = getMarketingStrategiesForCompetitor(selectedCompetitor)

  useEffect(() => {
    try {
    setIsLoading(true);
    const fetchData = async () => {
      const data = await getCompetitors();
      setCompetitors(data);
      setSelectedCompetitor(data[0].id);
    };
    fetchData();
    setIsLoading(false);
  }catch (error) {
    console.error("Error fetching competitors data:", error);
    setIsLoading(false);
  }
  }, []);

  // Calculer les statistiques de prix pour le concurrent sélectionné
  const competitorPrices = priceHistory.filter((item) => item.competitorId === selectedCompetitor)

  // Regrouper par catégorie de produit
  const pricesByCategory = {}
  competitorPrices.forEach((price) => {
    const product = products.find((p) => p.id === price.productId)
    if (product) {
      if (!pricesByCategory[product.category]) {
        pricesByCategory[product.category] = []
      }
      pricesByCategory[product.category].push(price)
    }
  })

  // Calculer le prix moyen par catégorie
  const averagePriceByCategory = Object.entries(pricesByCategory).map(([category, prices]) => {
    const sum = prices.reduce((acc, price) => acc + price.price, 0)
    return {
      category,
      averagePrice: sum / prices.length,
    }
  })

  // Données pour le graphique de répartition des produits
  const productDistribution = [
    { name: "Informatique", value: 45 },
    { name: "Téléphonie", value: 30 },
    { name: "Accessoires", value: 15 },
    { name: "Autres", value: 10 },
  ]

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen animate-spin">
        <Loader />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analyse concurrentielle</h1>
        <p className="text-muted-foreground">Analysez en détail les stratégies et positionnements de vos concurrents</p>
      </div>

      <div className="w-full md:w-1/2">
        <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un concurrent" />
          </SelectTrigger>
          <SelectContent>
            {competitors.map((competitor : {id : string,name : string}) => (
              <SelectItem key={competitor.id} value={competitor.id}>
                {competitor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil du concurrent</CardTitle>
          <CardDescription>Informations générales sur {competitor?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
              <Image
                src={competitor?.logo || "/placeholder.svg"}
                alt={competitor?.name || "Logo"}
                width={200}
                height={80}
                className="rounded-md border p-2"
              />
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold">{competitor?.name}</h3>
                <p className="text-muted-foreground">{competitor?.category}</p>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a href={competitor?.website} target="_blank" rel="noopener noreferrer">
                    Visiter le site
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-2/3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Produits suivis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Dans 5 catégories différentes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Promotions actives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{competitorPromotions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Dernière le {new Date(competitorPromotions[0]?.startDate || Date.now()).toLocaleDateString("fr-FR")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Indice de prix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5</div>
                  <p className="text-xs text-muted-foreground">Base 100 = prix moyen du marché</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Part de marché estimée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {competitor?.id === "comp-1"
                      ? "35%"
                      : competitor?.id === "comp-2"
                        ? "30%"
                        : competitor?.id === "comp-3"
                          ? "20%"
                          : competitor?.id === "comp-4"
                            ? "10%"
                            : "5%"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +2.5% depuis le dernier trimestre
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pricing">Stratégie de prix</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prix moyens par catégorie</CardTitle>
                <CardDescription>Comparaison avec la moyenne du marché</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { category: "Ordinateurs", competitor: 2250, market: 2280 },
                      { category: "Smartphones", competitor: 2800, market: 2820 },
                      { category: "Écrans", competitor: 800, market: 790 },
                      { category: "Imprimantes", competitor: 300, market: 310 },
                      { category: "Tablettes", competitor: 1800, market: 1820 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name={competitor?.name} dataKey="competitor" fill="#0088FE" />
                    <Bar name="Moyenne du marché" dataKey="market" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historique des ajustements de prix</CardTitle>
              <CardDescription>Changements de prix significatifs détectés</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Ancien prix</TableHead>
                    <TableHead>Nouveau prix</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead>Contexte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      date: "10/06/2023",
                      product: "Samsung Galaxy S21",
                      oldPrice: 3100,
                      newPrice: 2650,
                      context: "Lancement d'une promotion",
                    },
                    {
                      date: "05/06/2023",
                      product: "Laptop HP Pavilion 15",
                      oldPrice: 2500,
                      newPrice: 2250,
                      context: "Alignement sur la concurrence",
                    },
                    {
                      date: "01/06/2023",
                      product: 'Écran Dell 27"',
                      oldPrice: 820,
                      newPrice: 800,
                      context: "Ajustement saisonnier",
                    },
                    {
                      date: "25/05/2023",
                      product: "iPad Air",
                      oldPrice: 1850,
                      newPrice: 1800,
                      context: "Nouveau modèle annoncé",
                    },
                    {
                      date: "20/05/2023",
                      product: "Imprimante Canon PIXMA",
                      oldPrice: 290,
                      newPrice: 300,
                      context: "Augmentation des coûts",
                    },
                  ].map((item, i) => {
                    const variation = (((item.newPrice - item.oldPrice) / item.oldPrice) * 100).toFixed(1)
                    const isNegative = item.newPrice < item.oldPrice

                    return (
                      <TableRow key={i}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.oldPrice.toFixed(2)} DT</TableCell>
                        <TableCell>{item.newPrice.toFixed(2)} DT</TableCell>
                        <TableCell>
                          <Badge variant={isNegative ? "default" : "destructive"}>
                            {isNegative ? "" : "+"}
                            {variation}%
                          </Badge>
                        </TableCell>
                        <TableCell>{item.context}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotions récentes</CardTitle>
              <CardDescription>Historique des promotions de {competitor?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competitorPromotions.map((promo, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{promo.title}</h3>
                        <p className="text-sm text-muted-foreground">{promo.description}</p>
                      </div>
                      <Badge className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {promo.discountType === "percentage"
                          ? `${promo.discountValue}%`
                          : promo.discountType === "fixed"
                            ? `${promo.discountValue} DT`
                            : "Bundle"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Début:</span>{" "}
                        {new Date(promo.startDate).toLocaleDateString("fr-FR")}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fin:</span>{" "}
                        {new Date(promo.endDate).toLocaleDateString("fr-FR")}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Catégorie:</span> {promo.category}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Code:</span> {promo.code || "N/A"}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-medium mb-2">Impact estimé:</h4>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">+15%</div>
                          <div className="text-xs text-muted-foreground">Ventes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-600">-8%</div>
                          <div className="text-xs text-muted-foreground">Marge</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">+12%</div>
                          <div className="text-xs text-muted-foreground">Trafic</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyse des promotions</CardTitle>
              <CardDescription>Tendances et stratégies promotionnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pourcentage",
                            value: competitorPromotions.filter((p) => p.discountType === "percentage").length,
                          },
                          {
                            name: "Montant fixe",
                            value: competitorPromotions.filter((p) => p.discountType === "fixed").length,
                          },
                          {
                            name: "Bundle",
                            value: competitorPromotions.filter((p) => p.discountType === "bundle").length,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Insights sur les promotions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        {competitor?.name} privilégie les promotions de type <strong>pourcentage</strong>, représentant{" "}
                        {Math.round(
                          (competitorPromotions.filter((p) => p.discountType === "percentage").length /
                            competitorPromotions.length) *
                            100,
                        )}
                        % de leurs offres.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        La durée moyenne des promotions est de <strong>14 jours</strong>, avec une tendance à des
                        promotions plus courtes mais plus fréquentes.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        Les promotions sont principalement concentrées sur la catégorie{" "}
                        <strong>
                          {(() => {
                            const categories = competitorPromotions.map((p) => p.category)
                            return categories
                              .sort(
                                (a, b) =>
                                  categories.filter((v) => v === a).length - categories.filter((v) => v === b).length,
                              )
                              .pop()
                          })()}
                        </strong>
                        .
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        Les promotions sont généralement lancées en <strong>réponse</strong> aux actions des concurrents
                        plutôt qu'en initiative.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

    

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des produits</CardTitle>
              <CardDescription>Distribution des produits par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {productDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Analyse du catalogue produits</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        {competitor?.name} se concentre principalement sur les produits <strong>informatiques</strong>,
                        représentant 45% de leur catalogue.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Leur offre de <strong>téléphonie</strong> est également significative avec 30% du catalogue.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Les <strong>accessoires</strong> (15%) et <strong>autres produits</strong> (10%) complètent leur
                        offre.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Leur stratégie produit est{" "}
                        <strong>
                          {competitor?.id === "comp-1" || competitor?.id === "comp-2"
                            ? "diversifiée, couvrant un large éventail de catégories"
                            : competitor?.id === "comp-3"
                              ? "axée sur le volume avec une large gamme de prix"
                              : "spécialisée, se concentrant sur des niches spécifiques"}
                        </strong>
                        .
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produits phares</CardTitle>
              <CardDescription>Produits les plus populaires chez {competitor?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Popularité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Samsung Galaxy S21",
                      category: "Téléphonie",
                      price: 2650,
                      stock: "En stock",
                      popularity: "Très élevée",
                    },
                    {
                      name: "Laptop HP Pavilion 15",
                      category: "Informatique",
                      price: 2250,
                      stock: "En stock",
                      popularity: "Élevée",
                    },
                    {
                      name: 'Écran Dell 27"',
                      category: "Informatique",
                      price: 800,
                      stock: "En stock",
                      popularity: "Moyenne",
                    },
                    {
                      name: "iPad Air",
                      category: "Informatique",
                      price: 1800,
                      stock: "Rupture",
                      popularity: "Élevée",
                    },
                    {
                      name: "Imprimante Canon PIXMA",
                      category: "Informatique",
                      price: 300,
                      stock: "En stock",
                      popularity: "Faible",
                    },
                  ].map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.price.toFixed(2)} DT</TableCell>
                      <TableCell>
                        <Badge variant={item.stock === "En stock" ? "outline" : "destructive"}>{item.stock}</Badge>
                      </TableCell>
                      <TableCell>{item.popularity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
