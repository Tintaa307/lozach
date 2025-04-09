import { Clock, Heart, User, ShoppingCart, PackageOpen } from "lucide-react"
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
import { getLastCartArticles } from "@/actions/last-cart-articles/last-cart-articles"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/types"
import ShoppingCartButton from "./ShoppingCartButton"

export default async function UserProfile() {
  const supabase = createClient()

  const { user } = (await (await supabase).auth.getUser()).data

  const response = await getFavorites()

  const ids = response?.data?.map((item) => item.product_id) || []

  const favorites = await getProductsByFavorites(ids as number[])

  const lastViewArticles = await getLastViewArticles()

  const prodcuts_ids =
    lastViewArticles?.data?.map((item) => item.product_id) || []

  const lastViewProducts = await getProductsByIdArray(prodcuts_ids as number[])

  const lastCartArticles = await getLastCartArticles()

  const cart_ids = lastCartArticles?.data?.map((item) => item.product_id) || []

  const lastCartProducts = await getProductsByIdArray(cart_ids as number[])

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
                    {user?.email || "usuario@ejemplo.com"}
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
                  lastViewProducts.data &&
                  lastViewProducts.data.length > 0 ? (
                    lastViewProducts.data.map((item) => (
                      <Link
                        href={`/products/${item.id}`}
                        className="cursor-pointer"
                        key={`recent-${item.id}`}
                      >
                        <ArticleItem name={item.name} type="recent" />
                      </Link>
                    ))
                  ) : (
                    <EmptyState
                      type="recent"
                      message="No has visto ningún artículo recientemente"
                      actionText="Explorar productos"
                      actionLink="/products"
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="saved">
                <div className="space-y-3">
                  {favorites && favorites.data && favorites.data.length > 0 ? (
                    favorites.data.map((item) => (
                      <Link
                        href={`/products/${item.id}`}
                        key={`saved-${item.id}`}
                        className="w-full"
                      >
                        <ArticleItem name={item.name} type="saved" />
                      </Link>
                    ))
                  ) : (
                    <EmptyState
                      type="saved"
                      message="No tienes artículos guardados"
                      actionText="Descubrir favoritos"
                      actionLink="/products"
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="cart">
                <div className="space-y-3">
                  {lastCartProducts &&
                  lastCartProducts.data &&
                  lastCartProducts.data.length > 0 ? (
                    lastCartProducts.data.map((item) => (
                      <Link
                        href={`/products/${item.id}`}
                        key={`cart-${item.id}`}
                        className="w-full"
                      >
                        <ArticleItem
                          name={item.name}
                          type="cart"
                          product={item as Product}
                        />
                      </Link>
                    ))
                  ) : (
                    <EmptyState
                      type="cart"
                      message="No tienes artículos en el carrito"
                      actionText="Ir a comprar"
                      actionLink="/products"
                    />
                  )}
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
  product?: Product
}

function ArticleItem({ name, type, product }: ArticleItemProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md my-2">
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/10 flex items-center justify-center">
            {type === "recent" ? (
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            ) : type === "saved" ? (
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            ) : (
              // <ShoppingCartButton
              //   product={{
              //     color: product?.color,
              //     id: product?.id,
              //     image: product?.image_url,
              //     name: product?.name,
              //     price: product?.price,
              //     quantity: 1,
              //     size: product?.size,
              //   }}
              // />

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

interface EmptyStateProps {
  type: "recent" | "saved" | "cart"
  message: string
  actionText: string
  actionLink: string
}

function EmptyState({
  type,
  message,
  actionText,
  actionLink,
}: EmptyStateProps) {
  return (
    <Card className="overflow-hidden border border-dashed border-gray-200 bg-gray-50/50">
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {type === "recent" ? (
            <Clock className="h-8 w-8 text-primary" />
          ) : type === "saved" ? (
            <Heart className="h-8 w-8 text-primary" />
          ) : (
            <PackageOpen className="h-8 w-8 text-primary" />
          )}
        </div>
        <h3 className="text-lg font-medium mb-2">
          {type === "recent"
            ? "Sin artículos recientes"
            : type === "saved"
            ? "Sin favoritos"
            : "Carrito vacío"}
        </h3>
        <p className="text-muted-foreground mb-4 max-w-xs">{message}</p>
        <Button asChild variant="outline" className="gap-2">
          <Link href={actionLink}>
            {type === "recent" ? (
              <Clock className="h-4 w-4" />
            ) : type === "saved" ? (
              <Heart className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {actionText}
          </Link>
        </Button>
      </div>
    </Card>
  )
}
