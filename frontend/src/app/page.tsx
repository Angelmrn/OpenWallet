import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center px-6 py-32 text-center sm:px-16">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
            <Wallet className="h-4 w-4" />
            <span>Gestión de puntos simplificada</span>
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
            Bienvenido a{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Open Wallet
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Crea tus organizaciones, invita a tu equipo y{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              recompensa
            </span>{" "}
            a tus colaboradores por su buen trabajo.
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2">
              Empezar ahora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
