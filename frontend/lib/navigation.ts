import {
  BarChart3,
  LineChart,
  Tag,
  TrendingUp,
  Bell,
  Settings,
  Home,
  Target,
  Layers,
  Users,
  Shield,
} from "lucide-react";

// Standard navigation items visible to all authenticated users
export const navigation = [
  { name: "Tableau de bord", href: "/", icon: Home },
  {
    name: "Analyse concurrentielle",
    href: "/analyse-concurrentielle",
    icon: Target,
  },
  { name: "Suivi des prix", href: "/suivi-prix", icon: LineChart },
  { name: "Promotions", href: "/promotions", icon: Tag },
  { name: "Prédictions", href: "/predictions", icon: TrendingUp },
  { name: "Alertes", href: "/alertes", icon: Bell },
  { name: "Rapports", href: "/rapports", icon: BarChart3 },
  { name: "Paramètres", href: "/parametres", icon: Settings },
];

// Admin-specific navigation items
export const adminNavigation = [
  { name: "Administration", href: "/admin", icon: Shield },
  { name: "Gestion des utilisateurs", href: "/admin/users", icon: Users },
];

// Returns navigation items based on user role
export const getNavigationByRole = (role?: string) => {
  switch (role) {
    case "admin":
      return [...navigation, ...adminNavigation];
    case "marketing_analyst":
      return navigation;
    default:
      return navigation;
  }
};
