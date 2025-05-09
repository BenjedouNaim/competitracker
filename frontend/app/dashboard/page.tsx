"use client"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Bell, PercentIcon, Tag, Target } from "lucide-react"
import { dashboardStats, alerts } from "@/lib/mock-data"
import {
  Area,
  AreaChart,
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

export default async function Dashboard() {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de la surveillance concurrentielle et des indicateurs clés
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Concurrents suivis</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCompetitors}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.totalProductsTracked} produits surveillés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Variation moyenne des prix</CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{dashboardStats.averagePriceChange}%</div>
              <ArrowDown className="ml-2 h-4 w-4 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground">Sur les 30 derniers jours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Promotions actives</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activePromotions}</div>
            <p className="text-xs text-muted-foreground">Chez tous les concurrents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes aujourd&apos;hui</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.alertsToday}</div>
            <p className="text-xs text-muted-foreground">{alerts.filter((a) => !a.read).length} non lues</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex justify-center bg-transparent p-0 gap-2">
          <TabsTrigger
            value="overview"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Vue d&apos;ensemble
          </TabsTrigger>
          <TabsTrigger
            value="prices"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Prix
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Évolution des prix</CardTitle>
                <CardDescription>Tendance des prix sur les 30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { date: "01/05", mytek: 2300, tunisianet: 2250, jumia: 2200 },
                      { date: "05/05", mytek: 2310, tunisianet: 2260, jumia: 2190 },
                      { date: "10/05", mytek: 2290, tunisianet: 2240, jumia: 2180 },
                      { date: "15/05", mytek: 2280, tunisianet: 2230, jumia: 2170 },
                      { date: "20/05", mytek: 2270, tunisianet: 2220, jumia: 2160 },
                      { date: "25/05", mytek: 2260, tunisianet: 2210, jumia: 2150 },
                      { date: "30/05", mytek: 2250, tunisianet: 2200, jumia: 2140 },
                      { date: "01/06", mytek: 2240, tunisianet: 2190, jumia: 2130 },
                      { date: "05/06", mytek: 2230, tunisianet: 2180, jumia: 2120 },
                      { date: "10/06", mytek: 2220, tunisianet: 2170, jumia: 2110 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorMytek" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTunisianet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorJumia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FFBB28" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="mytek" stroke="#0088FE" fillOpacity={1} fill="url(#colorMytek)" />
                    <Area
                      type="monotone"
                      dataKey="tunisianet"
                      stroke="#00C49F"
                      fillOpacity={1}
                      fill="url(#colorTunisianet)"
                    />
                    <Area type="monotone" dataKey="jumia" stroke="#FFBB28" fillOpacity={1} fill="url(#colorJumia)" />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Parts de marché estimées</CardTitle>
                <CardDescription>Basé sur le volume de produits et la présence en ligne</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.marketShareData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardStats.marketShareData.map((entry, index) => (
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Indice de prix par catégorie</CardTitle>
                <CardDescription>Base 100 = Mytek (référence)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardStats.priceIndexByCategory}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[90, 110]} />
                    <YAxis dataKey="category" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tunisianet" fill="#00C49F" />
                    <Bar dataKey="jumia" fill="#FFBB28" />
                    <Bar dataKey="wiki" fill="#FF8042" />
                    <Bar dataKey="technopro" fill="#8884D8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Changements de prix récents</CardTitle>
                <CardDescription>Variations significatives détectées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats.recentPriceChanges.map((change, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-full flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{change.product}</p>
                          <p className="text-sm text-muted-foreground">{change.competitor}</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={change.change < 0 ? "default" : "destructive"} className="mr-2">
                            {change.change > 0 ? (
                              <ArrowUp className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="mr-1 h-3 w-3" />
                            )}
                            {Math.abs(change.change)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">{change.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="prices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison des prix par concurrent</CardTitle>
              <CardDescription>Prix moyens des produits suivis par concurrent</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Ordinateurs", mytek: 2250, tunisianet: 2200, jumia: 2150, wiki: 2300, technopro: 2320 },
                    { name: "Smartphones", mytek: 2800, tunisianet: 2850, jumia: 2700, wiki: 2830, technopro: 2900 },
                    { name: "Écrans", mytek: 800, tunisianet: 790, jumia: 770, wiki: 780, technopro: 810 },
                    { name: "Imprimantes", mytek: 300, tunisianet: 290, jumia: 280, wiki: 295, technopro: 305 },
                    { name: "Tablettes", mytek: 1800, tunisianet: 1820, jumia: 1750, wiki: 1850, technopro: 1880 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mytek" fill="#0088FE" />
                  <Bar dataKey="tunisianet" fill="#00C49F" />
                  <Bar dataKey="jumia" fill="#FFBB28" />
                  <Bar dataKey="wiki" fill="#FF8042" />
                  <Bar dataKey="technopro" fill="#8884D8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
