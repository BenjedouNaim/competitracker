"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  Users,
  UserCheck,
  UserCog,
  UserPlus,
  LineChart,
  Activity,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Type definition for our stats
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
  admins: number;
  marketingAnalysts: number;
  newUsersThisWeek: number;
  loginActivity: { date: string; count: number }[];
  usersByRole: { name: string; value: number }[];
}

// Initial empty stats
const initialStats: AdminStats = {
  totalUsers: 0,
  activeUsers: 0,
  pendingUsers: 0,
  inactiveUsers: 0,
  admins: 0,
  marketingAnalysts: 0,
  newUsersThisWeek: 0,
  loginActivity: [],
  usersByRole: [],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    async function fetchAdminStats() {
      setIsLoading(true);
      const supabase = createClient();

      try {
        // Get total users count
        const { count: totalUsers } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        // Get active users count
        const { count: activeUsers } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        // Get pending users count
        const { count: pendingUsers } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Get inactive users count
        const { count: inactiveUsers } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("status", "inactive");

        // Get admins count
        const { count: admins } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin");

        // Get marketing analysts count
        const { count: marketingAnalysts } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "marketing_analyst");

        // Get new users this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const { count: newUsersThisWeek } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .gt("created_at", oneWeekAgo.toISOString());

        // For demo purposes, generate mock login activity data
        const loginActivity = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: date.toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
            }),
            count: Math.floor(Math.random() * 15) + 5,
          };
        }).reverse();

        // Create users by role data for the pie chart
        const usersByRole = [
          { name: "Admin", value: admins || 0 },
          { name: "Marketing", value: marketingAnalysts || 0 },
          {
            name: "Autres",
            value: (totalUsers || 0) - (admins || 0) - (marketingAnalysts || 0),
          },
        ].filter((item) => item.value > 0);

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          pendingUsers: pendingUsers || 0,
          inactiveUsers: inactiveUsers || 0,
          admins: admins || 0,
          marketingAnalysts: marketingAnalysts || 0,
          newUsersThisWeek: newUsersThisWeek || 0,
          loginActivity,
          usersByRole,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord administrateur
        </h1>
        <p className="text-muted-foreground">
          Statistiques et gestion de l&apos;application Competitracker
        </p>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/users">
            <Users className="mr-2 h-4 w-4" />
            Gérer les utilisateurs
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs totaux
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newUsersThisWeek} nouveaux cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs actifs
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}%
              du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs en attente
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingUsers}</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une approbation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Administrateurs
            </CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">Avec accès complet</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Distribution des rôles</CardTitle>
                <CardDescription>
                  Répartition des utilisateurs par rôle
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.usersByRole}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {stats.usersByRole.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Statut des comptes</CardTitle>
                <CardDescription>
                  Vue d&apos;ensemble de l&apos;état des comptes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Actifs", value: stats.activeUsers },
                      { name: "En attente", value: stats.pendingUsers },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité de connexion</CardTitle>
              <CardDescription>
                Nombre de connexions par jour (derniers 7 jours)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.loginActivity}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Connexions" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
