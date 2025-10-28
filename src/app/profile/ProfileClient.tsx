"use client"

import { Clock, Heart, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import LogoutButton from "./logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicUser } from "@/types/auth/types"
import { FavoriteWithProduct } from "@/types/favorites/types"
import { RecentViewWithProduct } from "@/types/recent-views/types"
import { RecentCartWithProduct } from "@/types/recent-cart/types"
import Image from "next/image"

interface ProfileClientProps {
  user: PublicUser
  favorites: FavoriteWithProduct[]
  lastViewProducts: RecentViewWithProduct[]
  lastCartProducts: RecentCartWithProduct[]
}

export default function ProfileClient({
  user,
  favorites,
  lastViewProducts,
  lastCartProducts,
}: ProfileClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {user.role === "admin" ? "Administrador" : "Cliente"}
                </Badge>
              </div>
              <LogoutButton />
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Vistos Recientemente
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Carrito Reciente
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Productos Favoritos
                </h2>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <Card key={favorite.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <Image
                            width={500}
                            height={500}
                            src={
                              favorite.product.image_url || "/placeholder.jpg"
                            }
                            alt={favorite.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {favorite.product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">
                              ${favorite.product.price.toLocaleString()}
                            </span>
                            <Link href={`/products/${favorite.product.id}`}>
                              <Button size="sm">Ver</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No tienes productos favoritos aún
                    </p>
                    <Link href="/products">
                      <Button className="mt-4">Explorar Productos</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Views Tab */}
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Vistos Recientemente
                </h2>
              </CardHeader>
              <CardContent>
                {lastViewProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lastViewProducts.map((recentView) => (
                      <Card key={recentView.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <Image
                            width={500}
                            height={500}
                            src={
                              recentView.product.image_url || "/placeholder.jpg"
                            }
                            alt={recentView.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {recentView.product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">
                              ${recentView.product.price.toLocaleString()}
                            </span>
                            <Link href={`/products/${recentView.product.id}`}>
                              <Button size="sm">Ver</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No has visto productos recientemente
                    </p>
                    <Link href="/products">
                      <Button className="mt-4">Explorar Productos</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Cart Tab */}
          <TabsContent value="cart" className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito Reciente
                </h2>
              </CardHeader>
              <CardContent>
                {lastCartProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lastCartProducts.map((recentCart) => (
                      <Card key={recentCart.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <Image
                            width={500}
                            height={500}
                            src={
                              recentCart.product.image_url || "/placeholder.jpg"
                            }
                            alt={recentCart.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {recentCart.product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">
                              ${recentCart.product.price.toLocaleString()}
                            </span>
                            <Link href={`/products/${recentCart.product.id}`}>
                              <Button size="sm">Ver</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No tienes productos en tu carrito reciente
                    </p>
                    <Link href="/products">
                      <Button className="mt-4">Explorar Productos</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
