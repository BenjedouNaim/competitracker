"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { competitors, products, priceHistory } from "@/lib/mock-data"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function PriceTracking() {
  const [selectedProduct, setSelectedProduct] = useState(products[0].id)
  const [selectedCompetitor, setSelectedCompetitor] = useState("all")

  // Filtrer les données de prix pour le produit sélectionné
  const filteredPriceData = priceHistory
    .filter((item) => item.productId === selectedProduct)
    .filter((item) => selectedCompetitor === "all" || item.competitorId === selectedCompetitor)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Préparer les données pour le graphique
  const chartData = []
  const competitorColors = {
    "comp-1": "#0088FE", // Mytek
    "comp-2": "#00C49F", // Tunisianet
    "comp-3": "#FFBB28", // Jumia
    "comp-4": "#FF8042", // Wiki
    "comp-5": "#8884D8", // Technopro
  }

  // Regrouper les données par date
  const groupedByDate = {}
  filteredPriceData.forEach((item) => {
    const date = new Date(item.date).toLocaleDateString("fr-FR")
    if (!groupedByDate[date]) {
      groupedByDate[date] = {}
    }

    const competitorName = competitors.find((c) => c.id === item.competitorId)?.name || item.competitorId
    groupedByDate[date][competitorName] = item.price
  })

  // Convertir en format pour le graphique
  Object.keys(groupedByDate).forEach((date) => {
    chartData.push({
      date,
      ...groupedByDate[date],
    })
  })

  // Préparer les données pour le tableau de comparaison
  const latestPrices = {}
  competitors.forEach((competitor) => {
    const latestPrice = filteredPriceData
      .filter((item) => item.competitorId === competitor.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    if (latestPrice) {
      latestPrices[competitor.id] = latestPrice
    }
  })

  // Trouver le prix minimum et maximum
  const priceValues = Object.values(latestPrices).map((item) => item.price)
  const minPrice = Math.min(...priceValues)
  const maxPrice = Math.max(...priceValues)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Suivi des prix</h1>
        <p className="text-muted-foreground">Analysez l&apos;évolution des prix et comparez les concurrents</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un produit" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/2">
          <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un concurrent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les concurrents</SelectItem>
              {competitors.map((competitor) => (
                <SelectItem key={competitor.id} value={competitor.id}>
                  {competitor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="evolution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="evolution">Évolution des prix</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des prix dans le temps</CardTitle>
              <CardDescription>
                {products.find((p) => p.id === selectedProduct)?.name} -
                {selectedCompetitor === "all"
                  ? " Tous les concurrents"
                  : ` ${competitors.find((c) => c.id === selectedCompetitor)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedCompetitor === "all" ? (
                    competitors.map((competitor) => (
                      <Line
                        key={competitor.id}
                        type="monotone"
                        dataKey={competitor.name}
                        stroke={competitorColors[competitor.id]}
                        activeDot={{ r: 8 }}
                      />
                    ))
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={competitors.find((c) => c.id === selectedCompetitor)?.name}
                      stroke={competitorColors[selectedCompetitor]}
                      activeDot={{ r: 8 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
