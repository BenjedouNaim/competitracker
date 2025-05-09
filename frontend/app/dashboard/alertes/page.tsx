"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { alerts, competitors } from "@/lib/mock-data"
import { Bell, DollarSign, LineChart, ShoppingBag, Tag } from "lucide-react"

export default function AlertsPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Filtrer les alertes selon les sélections
  const filteredAlerts = alerts
    .filter((alert) => selectedType === "all" || alert.type === selectedType)
    .filter((alert) => selectedSeverity === "all" || alert.severity === selectedSeverity)
    .filter(
      (alert) =>
        selectedStatus === "all" ||
        (selectedStatus === "read" && alert.read) ||
        (selectedStatus === "unread" && !alert.read),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alertes</h1>
        <p className="text-muted-foreground">Notifications et alertes concernant vos concurrents</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type d'alerte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="strategy">Stratégie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/3">
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="Sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sévérités</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/3">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="read">Lues</SelectItem>
              <SelectItem value="unread">Non lues</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertes ({filteredAlerts.length})</CardTitle>
          <CardDescription>Notifications importantes concernant vos concurrents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, i) => {
                const competitor = competitors.find((c) => c.id === alert.competitorId)?.name || "Inconnu"

                return (
                  <div key={i} className={`border rounded-lg p-4 ${!alert.read ? "border-primary" : ""}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            alert.severity === "high"
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
                              : alert.severity === "medium"
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {alert.type === "price" && <DollarSign className="h-5 w-5" />}
                          {alert.type === "promotion" && <Tag className="h-5 w-5" />}
                          {alert.type === "stock" && <ShoppingBag className="h-5 w-5" />}
                          {alert.type === "strategy" && <LineChart className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{competitor}</h3>
                            <Badge
                              variant={
                                alert.severity === "high"
                                  ? "destructive"
                                  : alert.severity === "medium"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {alert.severity === "high" ? "Haute" : alert.severity === "medium" ? "Moyenne" : "Basse"}
                            </Badge>
                            {!alert.read && <Badge variant="secondary">Non lue</Badge>}
                          </div>
                          <p>{alert.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.date).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {alert.read ? "Marquer comme non lue" : "Marquer comme lue"}
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium">Aucune alerte</h3>
                <p className="text-muted-foreground">Aucune alerte ne correspond à vos critères de filtrage.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
