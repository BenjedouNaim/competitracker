"use client"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, LineChart, BarChart3, Target, Tag, TrendingUp, Bell, ChevronDown, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react"
import HomeFooter from "@/components/home-footer"
import { ToggleTheme } from "@/components/mode-toggle"
import { motion, useScroll, useSpring, useTransform, useInView, AnimatePresence } from "framer-motion"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default  function HomePage() {
  const { toast } = useToast();
  
  // Animation references for scroll effects
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // State to track if elements are in view for animations
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  // Effect for scroll animations using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      root: null,
    };

    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHeroVisible(true);
      }
    }, observerOptions);

    const featuresObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setFeaturesVisible(true);
      }
    }, observerOptions);

    const testimonialsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTestimonialsVisible(true);
      }
    }, observerOptions);

    const ctaObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCtaVisible(true);
      }
    }, observerOptions);

    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (featuresRef.current) featuresObserver.observe(featuresRef.current);
    if (testimonialsRef.current) testimonialsObserver.observe(testimonialsRef.current);
    if (ctaRef.current) ctaObserver.observe(ctaRef.current);

    return () => {
      if (heroRef.current) heroObserver.unobserve(heroRef.current);
      if (featuresRef.current) featuresObserver.unobserve(featuresRef.current);
      if (testimonialsRef.current) testimonialsObserver.unobserve(testimonialsRef.current);
      if (ctaRef.current) ctaObserver.unobserve(ctaRef.current);
    };
  }, []);

  // Function to show a demo notification
  const showDemoToast = () => {
    toast({
      title: "Démonstration activée",
      description: "Vous pouvez maintenant explorer les fonctionnalités de Competitracker",
    })
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <PieChart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Competitracker</span>
            </Link>
          </div>
          
          
          <div className="flex items-center gap-2">

            <ToggleTheme />
            <Link href="/auth/login">
              <Button variant="ghost" className="md:hidden">Se connecter</Button>
              <Button variant="outline" className="hidden md:flex">Se connecter</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="md:hidden">S&apos;inscrire</Button>
              <Button className="hidden md:flex">S&apos;inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section 
          ref={heroRef} 
          className="w-full py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Surveillance concurrentielle <span className="text-primary">intelligente</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Suivez les prix, promotions et stratégies marketing de vos concurrents en temps réel
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Link href="/signup">
                  <Button size="lg" className="animate-pulse">Demande d'inscription</Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    En savoir plus
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center p-4 bg-muted/50 rounded-lg"
              >
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Données en temps réel</h3>
                <p className="text-center text-muted-foreground">Des informations actualisées pour rester compétitif</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center p-4 bg-muted/50 rounded-lg"
              >
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Interface intuitive</h3>
                <p className="text-center text-muted-foreground">Facile à utiliser et à interpréter</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center p-4 bg-muted/50 rounded-lg"
              >
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Alertes personnalisées</h3>
                <p className="text-center text-muted-foreground">Soyez informé en fonction de vos critères</p>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/_0.1),transparent)]"></div>
        </section>

        {/* Features Section */}
        <section 
          id="features" 
          ref={featuresRef} 
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/30"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={featuresVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={featuresVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  Fonctionnalités
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Tout ce dont vous avez besoin</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Des outils puissants pour surveiller efficacement vos concurrents
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={featuresVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8"
            >
              {[
                {
                  icon: <LineChart className="h-6 w-6 text-primary" />,
                  title: "Suivi des prix",
                  description: "Surveillez l'évolution des prix de vos concurrents et recevez des alertes en cas de changement significatif."
                },
                {
                  icon: <Tag className="h-6 w-6 text-primary" />,
                  title: "Analyse des promotions",
                  description: "Identifiez les stratégies promotionnelles de vos concurrents et anticipez leurs actions."
                },
                {
                  icon: <Target className="h-6 w-6 text-primary" />,
                  title: "Analyse concurrentielle",
                  description: "Obtenez des insights détaillés sur le positionnement et les stratégies de vos concurrents."
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-primary" />,
                  title: "Prédictions",
                  description: "Anticipez les tendances du marché grâce à nos algorithmes d'intelligence artificielle."
                },
                {
                  icon: <Bell className="h-6 w-6 text-primary" />,
                  title: "Alertes personnalisées",
                  description: "Configurez des alertes selon vos critères pour être informé des changements importants."
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-primary" />,
                  title: "Rapports détaillés",
                  description: "Générez des rapports personnalisés pour analyser les données selon vos besoins."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <Card className="border-primary/10 h-full">
                    <CardHeader className="flex flex-row items-center gap-2">
                      {feature.icon}
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
        
      </main>

     
      <Toaster />
    </div>
  )
}
