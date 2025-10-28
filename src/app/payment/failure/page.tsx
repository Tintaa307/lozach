import { Suspense } from "react"
import PaymentFailureClient from "./PaymentFailureClient"

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailureClient />
    </Suspense>
  )
}
