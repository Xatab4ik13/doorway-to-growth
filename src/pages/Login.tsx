import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoFull from "@/assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error === "Invalid login credentials" ? "Неверный email или пароль" : error);
      setLoading(false);
      return;
    }

    // Role-based redirect will happen via AuthRedirect
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-sidebar">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12">
        <img src={logoFull} alt="Brandoors" className="h-8 w-auto object-contain object-left" />
        <div>
          <h1 className="text-3xl font-semibold text-sidebar-primary leading-tight">
            Управляйте партнёрской сетью в одном месте
          </h1>
          <p className="mt-4 text-sm text-sidebar-foreground leading-relaxed max-w-sm">
            Каталог, заявки, аналитика и партнёры — всё под контролем в CRM Brandoors
          </p>
        </div>
        <p className="text-[11px] text-sidebar-foreground/50">© 2026 Brandoors. Все права защищены.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <img src={logoFull} alt="Brandoors" className="h-7 object-contain" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground text-center">Вход в CRM</h2>
            <p className="text-sm text-muted-foreground text-center mt-1 mb-8">Введите данные для входа в систему</p>

            {error && (
              <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@brandoors.su"
                    className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-border accent-foreground" />
                  <span className="text-xs text-muted-foreground">Запомнить</span>
                </label>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Забыли пароль?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-xl bg-foreground text-sm font-medium text-primary-foreground hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Вход..." : "Войти"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
