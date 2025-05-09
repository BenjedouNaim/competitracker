"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userSettings } from "@/lib/mock-data"
import { Bell, Clock, Globe, LayoutDashboard, Mail, Moon, Save, Settings, Smartphone, Sun } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState(userSettings)

  // Fonction pour mettre à jour les paramètres de notification
  const updateNotificationSetting = (key, value) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    })
  }

  // Fonction pour mettre à jour les préférences
  const updatePreference = (key, value) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>Gérez vos informations personnelles et de compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select value={settings.role} onValueChange={(value) => setSettings({ ...settings, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="analyst">Analyste</SelectItem>
                    <SelectItem value="viewer">Observateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Gérez vos paramètres de sécurité et de connexion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button>Changer le mot de passe</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Canaux de notification</CardTitle>
              <CardDescription>Configurez comment vous souhaitez recevoir les notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotificationSetting("email", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="app-notifications">Notifications dans l'application</Label>
                </div>
                <Switch
                  id="app-notifications"
                  checked={settings.notifications.app}
                  onCheckedChange={(checked) => updateNotificationSetting("app", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="slack-notifications">Notifications Slack</Label>
                </div>
                <Switch
                  id="slack-notifications"
                  checked={settings.notifications.slack}
                  onCheckedChange={(checked) => updateNotificationSetting("slack", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types d'alertes</CardTitle>
              <CardDescription>Choisissez les types d'alertes que vous souhaitez recevoir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="price-alerts">Alertes de prix</Label>
                </div>
                <Switch
                  id="price-alerts"
                  checked={settings.notifications.priceAlerts}
                  onCheckedChange={(checked) => updateNotificationSetting("priceAlerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="promotion-alerts">Alertes de promotions</Label>
                </div>
                <Switch
                  id="promotion-alerts"
                  checked={settings.notifications.promotionAlerts}
                  onCheckedChange={(checked) => updateNotificationSetting("promotionAlerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="stock-alerts">Alertes de stock</Label>
                </div>
                <Switch
                  id="stock-alerts"
                  checked={settings.notifications.stockAlerts}
                  onCheckedChange={(checked) => updateNotificationSetting("stockAlerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="strategy-alerts">Alertes de stratégie</Label>
                </div>
                <Switch
                  id="strategy-alerts"
                  checked={settings.notifications.strategyAlerts}
                  onCheckedChange={(checked) => updateNotificationSetting("strategyAlerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="report-generation">Génération de rapports</Label>
                </div>
                <Switch
                  id="report-generation"
                  checked={settings.notifications.reportGeneration}
                  onCheckedChange={(checked) => updateNotificationSetting("reportGeneration", checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Réinitialiser</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select value={settings.preferences.theme} onValueChange={(value) => updatePreference("theme", value)}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="mr-2 h-4 w-4" />
                        Clair
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" />
                        Sombre
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Système
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) => updatePreference("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        Français
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={settings.preferences.currency}
                  onValueChange={(value) => updatePreference("currency", value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TND">Dinar Tunisien (TND)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="USD">Dollar US (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Affichage des données</CardTitle>
              <CardDescription>Personnalisez l'affichage et la mise à jour des données</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dashboard-layout">Mise en page du tableau de bord</Label>
                <Select
                  value={settings.preferences.dashboardLayout}
                  onValueChange={(value) => updatePreference("dashboardLayout", value)}
                >
                  <SelectTrigger id="dashboard-layout">
                    <SelectValue placeholder="Sélectionner une mise en page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">
                      <div className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Compact
                      </div>
                    </SelectItem>
                    <SelectItem value="detailed">
                      <div className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Détaillé
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-refresh-rate">Fréquence de rafraîchissement des données</Label>
                <Select
                  value={settings.preferences.dataRefreshRate}
                  onValueChange={(value) => updatePreference("dataRefreshRate", value)}
                >
                  <SelectTrigger id="data-refresh-rate">
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Temps réel
                      </div>
                    </SelectItem>
                    <SelectItem value="hourly">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Toutes les heures
                      </div>
                    </SelectItem>
                    <SelectItem value="daily">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Quotidien
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Réinitialiser</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
