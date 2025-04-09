import { Clock, Heart, User, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import LogoutButton from "./logout-button"
import {
  getFavorites,
  getProductsByFavorites,
} from "@/actions/favorites/favorites"
import Link from "next/link"
import { getLastViewArticles } from "@/actions/last-view-articles/last-view-articles"
import { getProductsByIdArray } from "@/actions/products/products"

export default async function UserProfile() {
  const supabase = createClient()

  const { user } = (await (await supabase).auth.getUser()).data

  const response = await getFavorites()

  const ids = response?.data?.map((item) => item.product_id)

  const favorites = await getProductsByFavorites(ids as number[])

  const lastViewArticles = await getLastViewArticles()

  const prodcuts_ids = lastViewArticles?.data?.map((item) => item.product_id)

  const lastViewProducts = await getProductsByIdArray(prodcuts_ids as number[])

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="container mx-auto py-12 sm:py-24 px-2 sm:px-4 max-w-4xl">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary-foreground">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </AvatarFallback>
                  <AvatarImage src="/placeholder.svg" alt="User avatar" />
                </Avatar>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {user?.user_metadata.full_name || "Nombre Apellido"}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent" className="mt-4">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="recent"
                  className="gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">
                    Artículos Vistos Recientemente
                  </span>
                  <span className="xs:hidden">Recientes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Artículos Guardados</span>
                  <span className="xs:hidden">Guardados</span>
                </TabsTrigger>
                <TabsTrigger
                  value="cart"
                  className="gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">
                    Últimos Artículos en Carrito
                  </span>
                  <span className="xs:hidden">Carrito</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <div className="space-y-3">
                  {lastViewProducts &&
                    lastViewProducts.data?.map((item) => (
                      <ArticleItem
                        key={`recent-${item.id}`}
                        name={item.name}
                        type="recent"
                      />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="saved">
                <div className="space-y-3">
                  {favorites.data?.map((item) => (
                    <Link
                      href={`/products/${item.id}`}
                      key={`saved-${item.id}`}
                      className="w-full"
                    >
                      <ArticleItem name={item.name} type="saved" />
                    </Link>
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
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/10 flex items-center justify-center">
            {type === "recent" ? (
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            ) : type === "saved" ? (
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            ) : (
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm sm:text-base font-medium">{name}</p>
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
          className="gap-1 text-xs p-2"
        >
          {type === "recent" ? (
            <>
              <Clock className="h-4 w-4" />
              <span className="hidden xs:inline">Visto</span>
            </>
          ) : type === "saved" ? (
            <>
              <Heart className="h-4 w-4" />
              <span className="hidden xs:inline">Guardado</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden xs:inline">En Carrito</span>
            </>
          )}
        </Badge>
      </div>
    </Card>
  )
}
