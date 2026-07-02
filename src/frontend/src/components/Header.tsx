import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Brain,
  ChevronDown,
  ClipboardList,
  LogIn,
  LogOut,
  Menu,
  Shield,
  Skull,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS_PUBLIC = [
  { label: "Home", href: "/" },
  { label: "Guide", href: "/guide" },
  { label: "Compatibility", href: "/compatibility" },
];

const NAV_ITEMS_AUTH = [
  { label: "Home", href: "/" },
  { label: "Guide", href: "/guide" },
  { label: "Compatibility", href: "/compatibility" },
];

export function Header() {
  const { clear, loginStatus, identity } = useInternetIdentity();
  const { isLoggedIn, isAdmin, email, name, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const iiLoggedIn = loginStatus === "success" && !!identity;
  const shortPrincipal = identity
    ? `${identity.getPrincipal().toText().slice(0, 10)}…`
    : null;

  const handleEmailLogout = async () => {
    await logout();
    router.navigate({ to: "/login" });
    setUserMenuOpen(false);
  };

  const navItems = isLoggedIn ? NAV_ITEMS_AUTH : NAV_ITEMS_PUBLIC;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none pt-4 px-4">
      <div className="relative w-full max-w-4xl">
        <div className="relative pointer-events-auto w-full flex items-center justify-between gap-4 h-16 lg:px-5 lg:rounded-xl lg:backdrop-blur-xl lg:bg-card/60 lg:border lg:border-white/[0.14] lg:ring-1 lg:ring-white/[0.05] lg:shadow-[0_4px_32px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.08)_inset]">
          {/* Logo */}
          <a
            href={isLoggedIn ? "/" : "/login"}
            className="flex items-center shrink-0 transition-smooth hover:opacity-80"
          >
            <img
              src="/assets/images/Innerself_logo.png"
              alt="Inner-Self"
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-muted/50"
                data-ocid={`header.nav.${item.label.toLowerCase().replace(" ", "_")}_link`}
              >
                {item.label}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/admin"
                className="px-3 py-1.5 text-sm font-body text-primary hover:text-foreground transition-colors duration-200 rounded-md hover:bg-primary/10 flex items-center gap-1.5"
                data-ocid="header.nav.admin_link"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </a>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Email user session */}
            {isLoggedIn && (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm font-body text-foreground"
                  data-ocid="header.user_menu_button"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="max-w-[120px] truncate">
                    {name ?? email}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-lg shadow-card py-1 z-50">
                    <a
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                      data-ocid="header.profile_link"
                    >
                      <User className="w-3.5 h-3.5" />
                      My Profile
                    </a>
                    <a
                      href="/my-results"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                      data-ocid="header.my_results_link"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      My Results
                    </a>
                    {isAdmin && (
                      <a
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-body text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        data-ocid="header.admin_dropdown_link"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </a>
                    )}
                    <div className="border-t border-border my-1" />
                    <button
                      type="button"
                      onClick={handleEmailLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
                      data-ocid="header.logout_button"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Internet Identity (admin use) */}
            {!isLoggedIn && iiLoggedIn && shortPrincipal && (
              <Badge
                variant="secondary"
                className="hidden sm:flex items-center gap-1.5 text-xs font-body"
                data-ocid="header.ii_badge"
              >
                <Shield className="w-3 h-3" />
                {shortPrincipal}
              </Badge>
            )}

            {!isLoggedIn && !iiLoggedIn && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.navigate({ to: "/login" })}
                  className="gap-1.5 text-sm font-body transition-smooth"
                  aria-label="Sign in"
                  data-ocid="header.login_button"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign in</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.navigate({ to: "/signup" })}
                  className="gap-1.5 text-sm font-body transition-smooth hidden sm:flex"
                  data-ocid="header.signup_button"
                >
                  Sign up
                </Button>
              </>
            )}

            {/* II login for admin: shown only if no email session */}
            {!isLoggedIn && iiLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="gap-1.5 text-sm font-body transition-smooth"
                data-ocid="header.ii_logout_button"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out II</span>
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              data-ocid="header.mobile_menu_button"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm lg:hidden pointer-events-auto"
                onClick={() => setMobileOpen(false)}
                data-ocid="header.mobile_menu_backdrop"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 right-0 bottom-0 w-[280px] z-[70] bg-card border-l border-white/[0.14] shadow-2xl flex flex-col pointer-events-auto lg:hidden"
                data-ocid="header.mobile_menu_drawer"
              >
                <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
                  <span className="font-display font-semibold text-lg text-foreground">Menu</span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-1 p-4 overflow-y-auto">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="px-4 py-3 text-sm font-body text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                      data-ocid={`header.mobile_nav.${item.label.toLowerCase().replace(" ", "_")}_link`}
                    >
                      {item.label}
                    </a>
                  ))}
                  
                  {isLoggedIn && (
                    <>
                      <a
                        href="/my-results"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-body text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                        data-ocid="header.mobile_nav.my_results_link"
                      >
                        <ClipboardList className="w-4 h-4" />
                        My Results
                      </a>
                    </>
                  )}
                  
                  {isAdmin && (
                    <a
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-body text-primary hover:bg-primary/10 rounded-lg transition-colors mt-2"
                      onClick={() => setMobileOpen(false)}
                      data-ocid="header.mobile_nav.admin_link"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </a>
                  )}
                  
                  {isLoggedIn && (
                    <>
                      <div className="border-t border-border my-2 mx-2" />
                      <a
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-body text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                        data-ocid="header.mobile_nav.profile_link"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          handleEmailLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-body text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        data-ocid="header.mobile_nav.logout_button"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </>
                  )}
                  
                  {!isLoggedIn && (
                    <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border mx-2">
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                        onClick={() => {
                          setMobileOpen(false);
                          router.navigate({ to: "/login" });
                        }}
                        data-ocid="header.mobile_nav.login_button"
                      >
                        Sign in
                      </Button>
                      <Button
                        className="w-full justify-center gradient-warm-accent border-0 text-foreground"
                        onClick={() => {
                          setMobileOpen(false);
                          router.navigate({ to: "/signup" });
                        }}
                        data-ocid="header.mobile_nav.signup_button"
                      >
                        Sign up
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
