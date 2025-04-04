import { LogOut, Clock, Heart, User, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function UserProfile() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto py-24 px-4 max-w-4xl">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary-foreground">
                    <User className="h-8 w-8 text-primary" />
                  </AvatarFallback>
                  <AvatarImage src="/placeholder.svg" alt="User avatar" />
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">Nombre Apellido</h2>
                  <p className="text-muted-foreground">
                    nombreapellido@mail.com
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent" className="mt-4">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="recent" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Artículos Vistos Recientemente
                </TabsTrigger>
                <TabsTrigger value="saved" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Artículos Guardados
                </TabsTrigger>
                <TabsTrigger value="cart" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Últimos Artículos en Carrito
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <ArticleItem
                      key={`recent-${item}`}
                      name="Nombre Artículo"
                      type="recent"
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="saved">
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <ArticleItem
                      key={`saved-${item}`}
                      name="Nombre Artículo"
                      type="saved"
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="cart">
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <ArticleItem
                      key={`cart-${item}`}
                      name="Nombre Artículo"
                      type="cart"
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

interface ArticleItemProps {
  name: string
  type: "recent" | "saved" | "cart"
}

function ArticleItem({ name, type }: ArticleItemProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            {type === "recent" ? (
              <Clock className="h-5 w-5 text-primary" />
            ) : type === "saved" ? (
              <Heart className="h-5 w-5 text-primary" />
            ) : (
              <ShoppingCart className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">
              {type === "recent"
                ? "Visto recientemente"
                : type === "saved"
                ? "Guardado"
                : "Añadido al carrito"}
            </p>
          </div>
        </div>
        <Badge
          variant={
            type === "recent"
              ? "outline"
              : type === "saved"
              ? "secondary"
              : "default"
          }
          className="gap-1"
        >
          {type === "recent" ? (
            <>
              <Clock className="h-3 w-3" />
              <span>Visto</span>
            </>
          ) : type === "saved" ? (
            <>
              <Heart className="h-3 w-3" />
              <span>Guardado</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3 w-3" />
              <span>En Carrito</span>
            </>
          )}
        </Badge>
      </div>
    </Card>
  )
}
