import { redirect } from 'next/navigation'

export default function AccountRedirect() {
  // Redirect /account to /profile
  redirect('/profile')
}
