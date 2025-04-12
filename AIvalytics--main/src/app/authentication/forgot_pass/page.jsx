// This tells Next.js to render this page on client-side only
export const dynamic = 'force-dynamic'

import ForgotPasswordForm from './ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}