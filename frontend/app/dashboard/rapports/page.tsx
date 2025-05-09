"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { reports } from "@/lib/mock-data"
import {
  BarChart,
  Calendar,
  Clock,
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileText,
  Filter,
  LayoutDashboard,
  Mail,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react"

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")

  // Filtrer les rapports selon les sélections
  const filteredReports = reports
    .filter((report) => selectedType === "all" || report.type === selectedType)
    .filter((report) => selectedStatus === "all" || report.status === selectedStatus)
    .filter((report) => selectedFormat === "all" || report.format === selectedFormat)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  // Fonction pour obtenir l'icône du format
  const getFormatIcon = (format) => {
    switch (format) {
      case "pdf":
        return <FilePdf className="h-4 w-4" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />
      case "csv":
        return <FileText className="h-4 w-4" />
      case "dashboard":
        return <LayoutDashboard className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Fonction pour obtenir le nom du type de rapport
  const getReportTypeName = (type) => {
    switch (type) {
      case "price":
        return "Prix"
      case "competitor":
        return "Concurrent"
      case "promotion":
        return "Promotion"
      case "market":
        return "Marché"
      case "custom":
        return "Personnalisé"
      default:
        return type
    }
  }

  // Fonction pour obtenir le nom du statut
  const getStatusName = (status) => {
    switch (status) {
      case "scheduled":
        return "Planifié"
      case "generated":
        return "Généré"
      case "sent":
        return "Envoyé"
      case "draft":
        return "Brouillon"
      default:
        return status
    }
  }

  // Fonction pour obtenir la variante du badge de statut
  const getStatusVariant = (status) => {
    switch (status) {
      case "scheduled":
        return "outline"
      case "generated":
        return "default"
      case "sent":
        return "secondary"
      case "draft":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Fonction pour obtenir le nom de la fréquence
  const getFrequencyName = (frequency) => {
    switch (frequency) {
      case "daily":
        return "Quotidien"
      case "weekly":
        return "Hebdomadaire"
      case "monthly":
        return "Mensuel"
      case "quarterly":
        return "Trimestriel"
      case "custom":
        return "Personnalisé"
      case "one-time":
        return "Unique"
      default:
        return frequency
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
        <p className="text-muted-foreground">Gérez et consultez vos rapports d'analyse concurrentielle</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type de rapport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="competitor">Concurrent</SelectItem>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="market">Marché</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="scheduled">Planifié</SelectItem>
              <SelectItem value="generated">Généré</SelectItem>
              <SelectItem value="sent">Envoyé</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les formats</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="dashboard">Tableau de bord</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Nouveau rapport
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des rapports</TabsTrigger>
          <TabsTrigger value="scheduled">Rapports planifiés</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tous les rapports ({filteredReports.length})</CardTitle>
              <CardDescription>Liste complète des rapports générés et planifiés</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Dernière mise à jour</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getReportTypeName(report.type)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getFormatIcon(report.format)}
                            <span className="capitalize">{report.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(report.updatedAt)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(report.status)}>{getStatusName(report.status)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" title="Télécharger">
                              <Download className="h-4 w-4" />
                            </Button>
                            {report.status === "generated" && (
                              <Button variant="outline" size="icon" title="Envoyer par email">
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                            {report.status === "scheduled" && (
                              <Button variant="outline" size="icon" title="Générer maintenant">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Aucun rapport ne correspond à vos critères de filtrage.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports planifiés</CardTitle>
              <CardDescription>Rapports programmés pour génération automatique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reports
                  .filter((report) => report.status === "scheduled")
                  .map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <div className="bg-primary h-1"></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge variant="outline">{getReportTypeName(report.type)}</Badge>
                        </div>
                        <CardDescription>{report.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Fréquence: {getFrequencyName(report.frequency)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Prochaine: {report.nextSchedule ? formatDate(report.nextSchedule) : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            {getFormatIcon(report.format)}
                            <span>Format: {report.format.toUpperCase()}</span>
                          </div>
                          {report.recipients && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Destinataires: {report.recipients.length}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between mt-4">
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Modifier
                          </Button>
                          <Button variant="default" size="sm">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Générer maintenant
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {reports.filter((report) => report.status === "scheduled").length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <BarChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium">Aucun rapport planifié</h3>
                    <p className="text-muted-foreground">
                      Vous n'avez pas encore de rapports programmés pour génération automatique.
                    </p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Planifier un rapport
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
