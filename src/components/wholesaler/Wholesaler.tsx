import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Package, TrendingDown, Users } from "lucide-react"

export function WholesaleSection() {
  const whatsappNumber = "5491122791822" // Reemplazar con tu número
  const whatsappMessage = encodeURIComponent(
    "Hola! Me interesa información sobre compras mayoristas."
  )
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const benefits = [
    {
      icon: TrendingDown,
      title: "Precios Reducidos",
      description: "Obtené mejores precios por unidad en compras mayoristas",
    },
    {
      icon: Package,
      title: "Stock Garantizado",
      description: "Asegurá el stock necesario para tu negocio",
    },
    {
      icon: Users,
      title: "Atención Personalizada",
      description: "Asesoramiento dedicado para tus necesidades",
    },
  ]

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="font-playfair text-3xl tracking-tight font-extralight text-foreground uppercase">
              <span className="font-bold">Ofrecemos precios especiales</span>{" "}
              para compras mayoristas.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-pretty text-lg leading-relaxed text-muted-foreground mb-4">
              Potenciá tu negocio con nuestros precios especiales para compras
              mayoristas. Calidad premium con condiciones pensadas para vos.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <Card
                    key={benefit.title}
                    className="border border-border bg-card p-8 transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-pretty text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </Card>
                )
              })}
            </div>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
