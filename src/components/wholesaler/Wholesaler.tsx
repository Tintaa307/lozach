import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Package, TrendingDown, Users } from "lucide-react"

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="none"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
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
