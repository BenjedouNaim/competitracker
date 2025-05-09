"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { competitors, promotions } from "@/lib/mock-data"
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
import { Calendar, Clock, Tag } from "lucide-react"

export default function PromotionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCompetitor, setSelectedCompetitor] = useState("all")

  // Filtrer les promotions selon les sélections
  const filteredPromotions = promotions
    .filter(
      (promo) =>
        selectedCategory === "all" ||
        promo.category === selectedCategory ||
        (selectedCategory === "Tous produits" && promo.category === "Tous produits"),
    )
    .filter((promo) => selectedCompetitor === "all" || promo.competitorId === selectedCompetitor)

  // Obtenir toutes les catégories uniques
  const categories = ["all", ...new Set(promotions.map((promo) => promo.category))]

  // Données pour les graphiques
  const promotionsByCompetitor = competitors.map((competitor) => {
    return {
      name: competitor.name,
      value: promotions.filter((promo) => promo.competitorId === competitor.id).length,
    }
  })

  const promotionsByType = [
    {
      name: "Pourcentage",
      value: promotions.filter((promo) => promo.discountType === "percentage").length,
    },
    {
      name: "Montant fixe",
      value: promotions.filter((promo) => promo.discountType === "fixed").length,
    },
    {
      name: "Bundle",
      value: promotions.filter((promo) => promo.discountType === "bundle").length,
    },
  ]

  const promotionsByCategory = categories
    .filter((category) => category !== "all")
    .map((category) => {
      return {
        name: category,
        value: promotions.filter((promo) => promo.category === category).length,
      }
    })

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Suivi des promotions</h1>
        <p className="text-muted-foreground">Analysez les promotions et offres spéciales de vos concurrents</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
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

        <div className="w-full md:w-1/2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories
                .filter((category) => category !== "all")
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Promotions actives</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPromotions
              .filter((promo) => new Date(promo.endDate) >= new Date())
              .map((promo, i) => {
                const competitor = competitors.find((c) => c.id === promo.competitorId)

                return (
                  <Card key={i} className="overflow-hidden">
                    <div className="bg-primary h-1"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{promo.title}</CardTitle>
                          <CardDescription>{competitor?.name}</CardDescription>
                        </div>
                        <Badge className="ml-2">
                          {promo.discountType === "percentage"
                            ? `${promo.discountValue}%`
                            : promo.discountType === "fixed"
                              ? `${promo.discountValue} DT`
                              : "Bundle"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{promo.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Début: {formatDate(promo.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Fin: {formatDate(promo.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Tag className="h-4 w-4" />
                          <span>Catégorie: {promo.category}</span>
                        </div>
                        {promo.code && (
                          <div className="flex items-center gap-1 font-medium">
                            <span>Code: {promo.code}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {filteredPromotions.filter((promo) => new Date(promo.endDate) >= new Date()).length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <p className="text-muted-foreground">Aucune promotion active ne correspond à vos critères.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Promotions par concurrent</CardTitle>
                <CardDescription>Nombre de promotions lancées par chaque concurrent</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={promotionsByCompetitor}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types de promotions</CardTitle>
                <CardDescription>Répartition par type de remise</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={promotionsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {promotionsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Promotions par catégorie</CardTitle>
                <CardDescription>Répartition des promotions par catégorie de produits</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={promotionsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        name.length > 10
                          ? `${name.substring(0, 10)}... ${(percent * 100).toFixed(0)}%`
                          : `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {promotionsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Insights sur les promotions</CardTitle>
              <CardDescription>Analyse des tendances et stratégies promotionnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Fréquence</h3>
                    <p className="text-sm text-muted-foreground">
                      En moyenne, chaque concurrent lance{" "}
                      <span className="font-medium text-foreground">
                        {(promotions.length / competitors.length).toFixed(1)}
                      </span>{" "}
                      promotions par trimestre.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Durée moyenne</h3>
                    <p className="text-sm text-muted-foreground">
                      Les promotions durent en moyenne{" "}
                      <span className="font-medium text-foreground">
                        {(() => {
                          const durations = promotions.map(
                            (promo) =>
                              (new Date(promo.endDate).getTime() - new Date(promo.startDate).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )
                          return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                        })()}
                      </span>{" "}
                      jours.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Remise moyenne</h3>
                    <p className="text-sm text-muted-foreground">
                      Pour les promotions en pourcentage, la remise moyenne est de{" "}
                      <span className="font-medium text-foreground">
                        {(() => {
                          const percentageDiscounts = promotions
                            .filter((promo) => promo.discountType === "percentage")
                            .map((promo) => promo.discountValue)
                          return Math.round(percentageDiscounts.reduce((a, b) => a + b, 0) / percentageDiscounts.length)
                        })()}%
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Tendances observées</h3>
                  <ul className="space-y-2 text-sm list-disc pl-5">
                    <li>
                      <span className="text-muted-foreground">
                        Les promotions sont plus fréquentes pendant les périodes de{" "}
                        <span className="font-medium text-foreground">rentrée scolaire</span> et{" "}
                        <span className="font-medium text-foreground">fêtes de fin d'année</span>.
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">Mytek</span> et{" "}
                        <span className="font-medium text-foreground">Tunisianet</span> sont les plus actifs en termes
                        de promotions.
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        Les promotions sur les{" "}
                        <span className="font-medium text-foreground">ordinateurs portables</span> et{" "}
                        <span className="font-medium text-foreground">smartphones</span> offrent généralement les
                        remises les plus importantes.
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        Les promotions de type <span className="font-medium text-foreground">pourcentage</span> sont les
                        plus courantes, représentant {Math.round((promotionsByType[0].value / promotions.length) * 100)}
                        % du total.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des promotions</CardTitle>
              <CardDescription>Toutes les promotions passées et actuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Concurrent</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((promo, i) => {
                      const competitor = competitors.find((c) => c.id === promo.competitorId)
                      const now = new Date()
                      const startDate = new Date(promo.startDate)
                      const endDate = new Date(promo.endDate)

                      let status = "Terminée"
                      if (now >= startDate && now <= endDate) {
                        status = "Active"
                      } else if (now < startDate) {
                        status = "À venir"
                      }

                      return (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{promo.title}</TableCell>
                          <TableCell>{competitor?.name}</TableCell>
                          <TableCell>{promo.category}</TableCell>
                          <TableCell>
                            {promo.discountType === "percentage"
                              ? "Pourcentage"
                              : promo.discountType === "fixed"
                                ? "Montant fixe"
                                : "Bundle"}
                          </TableCell>
                          <TableCell>
                            {promo.discountType === "percentage"
                              ? `${promo.discountValue}%`
                              : promo.discountType === "fixed"
                                ? `${promo.discountValue} DT`
                                : "Bundle"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={status === "Active" ? "default" : status === "À venir" ? "outline" : "secondary"}
                            >
                              {status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
