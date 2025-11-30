import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../theme/ThemeProvider";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">MatBook - Employee Onboarding</Link>
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-blue-600" : "text-muted"}`
            }
          >
            Form
          </NavLink>
          <NavLink
            to="/submissions"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-blue-600" : "text-muted"}`
            }
          >
            Submissions
          </NavLink>
          <button className="text-sm px-2 py-1 rounded border" onClick={toggle}>
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}