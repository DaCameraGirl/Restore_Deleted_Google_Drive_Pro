import { auth, signIn, signOut } from "@/auth"
import TrashDashboard from "@/components/TrashDashboard"

function SignInButton() {
  return (
    <form action={async () => { "use server"; await signIn("google") }}>
      <button className="px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200">Sign in with Google</button>
    </form>
  )
}
function SignOutButton() {
  return (
    <form action={async () => { "use server"; await signOut() }}>
      <button className="text-sm text-zinc-400 hover:text-zinc-100">Sign out</button>
    </form>
  )
}

export default async function Page() {
  const session = await auth()
  const signedIn = !!session?.user
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-16">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold">Restore Deleted Google Drive Pro</h1>
          <p className="text-zinc-400 mt-1">Restore your Google Drive trash in one click. Free forever.</p>
        </div>
        {signedIn && <SignOutButton />}
      </header>
      {!signedIn ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
          <h2 className="text-xl font-semibold mb-2">Sign in to get started</h2>
          <p className="text-zinc-400 mb-6">We’ll scan your Drive trash — nothing gets restored until you say so.</p>
          <SignInButton />
          <p className="text-xs text-zinc-500 mt-6">Uses Google OAuth. We never store your files. Open source.</p>
        </div>
      ) : (
        <TrashDashboard />
      )}
      <footer className="mt-16 text-center text-xs text-zinc-600">
        <a className="hover:text-zinc-400" href="https://github.com/DaCameraGirl/Restore_Deleted_Google_Drive_Pro" target="_blank">GitHub</a>
      </footer>
    </main>
  )
}
