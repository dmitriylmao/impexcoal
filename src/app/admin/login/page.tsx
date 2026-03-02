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
    <div className="min-h-screen bg-[#020914] px-4 py-8">
      <main className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(9,19,35,0.92),rgba(4,10,22,0.88))] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-[#d8dfeb]">Вход в админ-панель</h1>

        {error ? (
          <p className="mt-4 rounded-md border border-red-400/30 bg-red-900/30 px-3 py-2 text-sm text-red-200">
            Неверный логин или пароль.
          </p>
        ) : null}

        <form action={login} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="text-[#aeb9ca]">Логин</span>
            <input
              name="username"
              required
              autoComplete="username"
              className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none transition placeholder:text-[#627188] focus:border-[#4e5f79] focus:ring-2 focus:ring-[#3a4d6f]"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[#aeb9ca]">Пароль</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none transition placeholder:text-[#627188] focus:border-[#4e5f79] focus:ring-2 focus:ring-[#3a4d6f]"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-md border border-white/15 bg-[linear-gradient(180deg,#121f35,#0b162a)] px-4 py-2 font-medium text-[#edf2fb] transition hover:border-[#ff6a00]/55 hover:text-white"
          >
            Войти
          </button>
        </form>
      </main>
    </div>
  );
}
