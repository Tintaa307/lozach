export interface CreateUserValues {
  name: string
  email: string
  password: string
}

export interface LoginUserValues {
  email: string
  password: string
}

export interface PublicUser {
  id: string
  created_at: string
  updated_at: string
  name: string
  email: string
  role: "admin" | "customer"
}

export interface UserSession {
  user: PublicUser
  access_token: string
  refresh_token: string
}
