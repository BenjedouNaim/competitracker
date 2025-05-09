"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { competitors, products, predictions } from "@/lib/mock-data"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AlertTriangle, BrainCircuit, LineChartIcon, Percent, TrendingUp } from "lucide-react"

export default function PredictionsPage() {
  const [selectedProduct, setSelectedProduct] = useState(products[0].id)
  const [selectedCompetitor, setSelectedCompetitor] = useState(competitors[0].id)

  // Filtrer les prédictions pour le produit et le concurrent sélectionnés
  const filteredPredictions = predictions
    .filter((pred) => !selectedProduct || pred.productId === selectedProduct || !pred.productId)
    .filter((pred) => !selectedCompetitor || pred.competitorId === selectedCompetitor || !pred.competitorId)

  // Données pour les graphiques de prédiction de prix
  const pricePredictionData = [
    { date: "Juin 2023", actual: 2250, predicted: 2250 },
    { date: "Juillet 2023", actual: 2200, predicted: 2150 },
    { date: "Août 2023", predicted: 2100 },
    { date: "Septembre 2023", predicted: 2050 },
    { date: "Octobre 2023", predicted: 2000 },
    { date: "Novembre 2023", predicted: 1950 },
  ]

  // Données pour les graphiques de prédiction de ventes
  const salesPredictionData = [
    { date: "Juin 2023", actual: 120, predicted: 125 },
    { date: "Juillet 2023", actual: 135, predicted: 140 },
    { date: "Août 2023", predicted: 160 },
    { date: "Septembre 2023", predicted: 180 },
    { date: "Octobre 2023", predicted: 210 },
    { date: "Novembre 2023", predicted: 250 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Prédictions</h1>
        <p className="text-muted-foreground">
          Prévisions basées sur l&apos;intelligence artificielle et l&apos;analyse des données
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les produits</SelectItem>
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

      <Tabs defaultValue="price" className="space-y-4">
        <TabsList>
          <TabsTrigger value="price">Prédiction des prix</TabsTrigger>
          <TabsTrigger value="sales">Prédiction des ventes</TabsTrigger>
          <TabsTrigger value="trends">Tendances émergentes</TabsTrigger>
          <TabsTrigger value="all">Toutes les prédictions</TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution prévue des prix</CardTitle>
              <CardDescription>Prédiction des prix pour les 6 prochains mois</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pricePredictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#0088FE"
                    name="Prix réel"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#FF8042"
                    name="Prix prédit"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Facteurs d&apos;influence</CardTitle>
                <CardDescription>Facteurs impactant les prédictions de prix</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Tendance historique</span>
                      </div>
                      <Badge variant="outline">Impact élevé</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Promotions concurrentes</span>
                      </div>
                      <Badge variant="outline">Impact moyen</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Ruptures de stock</span>
                      </div>
                      <Badge variant="outline">Impact faible</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Saisonnalité</span>
                      </div>
                      <Badge variant="outline">Impact moyen</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse prédictive</CardTitle>
                <CardDescription>Insights basés sur les modèles ML</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Baisse de prix prévue</p>
                      <p className="text-sm text-muted-foreground">
                        Une baisse de prix de <strong>13.3%</strong> est prévue sur les 6 prochains mois pour ce
                        produit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Confiance de la prédiction</p>
                      <p className="text-sm text-muted-foreground">
                        Le modèle a une confiance de <strong>85%</strong> dans cette prédiction, basée sur les données
                        historiques et les tendances du marché.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Recommandation</p>
                      <p className="text-sm text-muted-foreground">
                        Considérez une <strong>réduction progressive des prix</strong> pour rester compétitif tout en
                        maintenant les marges.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Alerte</p>
                      <p className="text-sm text-muted-foreground">
                        Une <strong>promotion majeure</strong> est anticipée chez les concurrents en septembre, ce qui
                        pourrait accélérer la baisse des prix.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prévision des ventes</CardTitle>
              <CardDescription>Prédiction des ventes pour les 6 prochains mois</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesPredictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF8042" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#0088FE"
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    name="Ventes réelles"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#FF8042"
                    fillOpacity={1}
                    fill="url(#colorPredicted)"
                    name="Ventes prédites"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Facteurs d&apos;influence</CardTitle>
                <CardDescription>Facteurs impactant les prédictions de ventes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Promotions</span>
                      </div>
                      <Badge variant="outline">Impact très élevé</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Saisonnalité</span>
                      </div>
                      <Badge variant="outline">Impact élevé</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Prix</span>
                      </div>
                      <Badge variant="outline">Impact moyen</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Concurrence</span>
                      </div>
                      <Badge variant="outline">Impact moyen</Badge>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse prédictive</CardTitle>
                <CardDescription>Insights basés sur les modèles ML</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Croissance prévue</p>
                      <p className="text-sm text-muted-foreground">
                        Une augmentation des ventes de <strong>108%</strong> est prévue sur les 6 prochains mois pour ce
                        produit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Confiance de la prédiction</p>
                      <p className="text-sm text-muted-foreground">
                        Le modèle a une confiance de <strong>72%</strong> dans cette prédiction, avec une marge
                        d&apos;erreur plus élevée pour les mois éloignés.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Recommandation</p>
                      <p className="text-sm text-muted-foreground">
                        Préparez votre <strong>stock et logistique</strong> pour une augmentation significative de la
                        demande à partir d&apos;août.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Opportunité</p>
                      <p className="text-sm text-muted-foreground">
                        Envisagez des <strong>bundles et upsells</strong> pour maximiser le revenu pendant cette période
                        de forte demande.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendances émergentes</CardTitle>
              <CardDescription>Détection des tendances du marché basée sur l&apos;analyse des données</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">Montée des ordinateurs portables ultralégers</h3>
                      <p className="text-sm text-muted-foreground">
                        Augmentation significative de l&apos;intérêt pour les laptops de moins de 1.2kg
                      </p>
                    </div>
                    <Badge>Confiance: 85%</Badge>
                  </div>

                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { mois: "Jan", interet: 100 },
                          { mois: "Fév", interet: 110 },
                          { mois: "Mar", interet: 120 },
                          { mois: "Avr", interet: 140 },
                          { mois: "Mai", interet: 170 },
                          { mois: "Juin", interet: 210 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mois" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="interet" stroke="#0088FE" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Recommandation:</h4>
                    <p className="text-sm text-muted-foreground">
                      Mettez en avant les modèles ultralégers dans votre catalogue et envisagez d&apos;élargir votre
                      gamme dans cette catégorie.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">Demande croissante pour les écrans haute résolution</h3>
                      <p className="text-sm text-muted-foreground">
                        Intérêt accru pour les écrans 4K et au-delà, particulièrement dans le segment professionnel
                      </p>
                    </div>
                    <Badge>Confiance: 78%</Badge>
                  </div>

                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { mois: "Jan", interet: 100 },
                          { mois: "Fév", interet: 105 },
                          { mois: "Mar", interet: 115 },
                          { mois: "Avr", interet: 130 },
                          { mois: "Mai", interet: 150 },
                          { mois: "Juin", interet: 180 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mois" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="interet" stroke="#00C49F" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Recommandation:</h4>
                    <p className="text-sm text-muted-foreground">
                      Augmentez votre stock d&apos;écrans 4K et créez des bundles avec des cartes graphiques
                      performantes pour cibler les professionnels.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Intérêt décroissant pour les tablettes d&apos;entrée de gamme
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Baisse de la demande pour les tablettes bas de gamme au profit des modèles premium
                      </p>
                    </div>
                    <Badge>Confiance: 70%</Badge>
                  </div>

                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { mois: "Jan", interet: 100 },
                          { mois: "Fév", interet: 95 },
                          { mois: "Mar", interet: 90 },
                          { mois: "Avr", interet: 85 },
                          { mois: "Mai", interet: 75 },
                          { mois: "Juin", interet: 65 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mois" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="interet" stroke="#FF8042" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Recommandation:</h4>
                    <p className="text-sm text-muted-foreground">
                      Réduisez progressivement votre stock de tablettes d&apos;entrée de gamme et concentrez-vous sur
                      les modèles premium avec des fonctionnalités avancées.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les prédictions</CardTitle>
              <CardDescription>Liste complète des prédictions générées par nos modèles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Produit / Concurrent</TableHead>
                    <TableHead>Valeur prédite</TableHead>
                    <TableHead>Confiance</TableHead>
                    <TableHead>Facteurs</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPredictions.map((pred, i) => {
                    const product = pred.productId ? products.find((p) => p.id === pred.productId)?.name : "Global"
                    const competitor = pred.competitorId
                      ? competitors.find((c) => c.id === pred.competitorId)?.name
                      : "Tous"

                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <Badge variant="outline">
                            {pred.type === "price" ? "Prix" : pred.type === "sales" ? "Ventes" : "Tendance"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {product} {competitor !== "Tous" ? `/ ${competitor}` : ""}
                        </TableCell>
                        <TableCell>
                          {pred.type === "price"
                            ? `${pred.predictedValue.toFixed(2)} DT`
                            : pred.type === "sales"
                              ? `${pred.predictedValue} unités`
                              : `${pred.predictedValue}% de croissance`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${pred.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span>{(pred.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pred.factors.map((factor, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(pred.date).toLocaleDateString("fr-FR")}
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
