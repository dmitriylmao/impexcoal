import { redirect } from 'next/navigation';
import { isAdminAuthenticated, signInAdmin } from '@/lib/admin-auth';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect('/admin');
  }

  const { error } = await searchParams;

  async function login(formData: FormData) {
    'use server';

    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    const success = await signInAdmin(username, password);

    if (!success) {
      redirect('/admin/login?error=1');
    }

    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6 md:p-10">
      <main className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Вход для управления контентом. После входа откроется /admin.
        </p>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Неверный логин или пароль.
          </p>
        ) : null}

        <form action={login} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">Логин</span>
            <input
              name="username"
              required
              autoComplete="username"
              className="rounded-md border border-zinc-300 px-3 py-2 outline-none ring-zinc-500 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">Пароль</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="rounded-md border border-zinc-300 px-3 py-2 outline-none ring-zinc-500 focus:ring-2"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800"
          >
            Войти
          </button>
        </form>
      </main>
    </div>
  );
}