import { Link, NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
import Button from "../common/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-gold/10 bg-brand-navy/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-white/5 text-brand-gold">
            <span className="text-sm font-bold tracking-[0.22em]">GG</span>
          </div>
          <div>
            <p className="font-display text-xl leading-none">Gold Group</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/55">
              Heating & Cooling
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-brand-gold ${
                  isActive ? "text-brand-gold" : "text-white/78"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#/contact" variant="primary" className="px-4 py-2.5 text-xs">
            Contact Gold Group
          </Button>
        </div>
      </div>
    </header>
  );
}
