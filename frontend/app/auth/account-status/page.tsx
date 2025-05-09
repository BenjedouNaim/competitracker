"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { logout } from "@/app/auth/logout";
import { redirect } from "next/navigation";

export default function AccountStatusPage() {
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserStatus() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/auth/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("status")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user status:", error);
        setIsLoading(false);
        return;
      }

      setAccountStatus(userData?.status || null);
      setIsLoading(false);

      // If account is active, redirect to dashboard
      if (userData?.status === "active") {
        redirect("/dashboard");
      }
    }

    checkUserStatus();
  }, []);

  async function handleLogout() {
    await logout();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md text-center">
          <p>Vérification du statut de votre compte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <div className="font-semibold">
              Compte {accountStatus === "pending" ? "en attente" : "suspendu"}
            </div>
          </div>
          <CardTitle className="text-2xl">Accès limité</CardTitle>
          <CardDescription>
            {accountStatus === "pending"
              ? "Votre compte est en attente d'approbation par un administrateur."
              : "Votre compte a été suspendu. Veuillez contacter l'administrateur."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {accountStatus === "pending"
              ? "Une fois votre compte approuvé, vous pourrez accéder à toutes les fonctionnalités de la plateforme. Ce processus peut prendre jusqu'à 24 heures."
              : "Pour plus d'informations sur la suspension de votre compte, veuillez contacter l'équipe d'assistance."}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogout} className="w-full">
            Se déconnecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
