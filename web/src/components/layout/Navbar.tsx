/**
 * سينما سلمية (Salamiyah Cinema) Top Navigation Bar & Footer (src/components/layout/Navbar.tsx)
 * Delivered by Badr (Stage 1)
 * Implements the official Salamiyah Cinema identity with Bilingual (AR RTL ↔ EN LTR) Toggle:
 * - Official logo (/assets/aistudio/Logo_f06ca4d2.jpg) + "سينما سلمية" Kufic header + "SALAMIYAH CINEMA" tracked Cinzel sublabel
 * - Deep matte black (#0F0F0F with backdrop-filter: blur(12px)) and crisp 2px solid #FDB813 bottom border
 * - LanguageToggle (عربي | EN) placed right next to the Dark/Light Theme toggle in Zone 3
 */

import React, { useState } from 'react';
import {
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Ticket,
  UserCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../store/auth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../lib/types';
import { Button } from '../ui/Kit';
import { LanguageToggle } from '../ui/LanguageToggle';
import { useToast } from '../ui/Toast';

export const SALAMIYAH_LOGO_URL = '/assets/Logo_f06ca4d2.jpg';

export interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const { user, logout, quickSwitchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleRoleSwitch = async (target: UserRole | 'GUEST') => {
    await quickSwitchRole(target);
    const roleNamesAr: Record<string, string> = {
      ADMIN: 'مدير النظام (ADMIN)',
      CUSTOMER: 'عميل (CUSTOMER)',
      STAFF: 'موظف القاعة (STAFF)',
      GUEST: 'زائر غير مسجل',
    };
    const roleNamesEn: Record<string, string> = {
      ADMIN: 'System Admin (ADMIN)',
      CUSTOMER: 'Customer (CUSTOMER)',
      STAFF: 'Hall Staff (STAFF)',
      GUEST: 'Guest User',
    };
    toast({
      variant: 'info',
      title:
        lang === 'en'
          ? `Switched test session to: ${roleNamesEn[target]}`
          : `تم تبديل جلسة الاختبار إلى: ${roleNamesAr[target]}`,
    });
  };

  const isMoviesSection = currentPath.startsWith('/movies');
  const isEventsSection = currentPath.startsWith('/events');
  const isAdminSection = currentPath.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#FDB813] bg-[#FFFDF7]/95 dark:bg-[#0F0F0F]/95 backdrop-blur-md no-print">
      {/* Subtle 45-degree clapperboard stripe bar inspired by the logo's "ة" */}
      <div className="h-1 w-full clapper-bar" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 md:gap-6">
        {/* Zone 1: Official Salamiyah Cinema Logo & Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          className="whitespace-nowrap shrink-0 flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-[#FDB813] rounded-[2px] group"
        >
          <img
            src={SALAMIYAH_LOGO_URL}
            alt={t('brand.name')}
            className="h-9 sm:h-11 w-auto object-contain rounded-[2px] border border-[#0F0F0F] dark:border-[#FDB813]/60 shadow-xs shrink-0"
          />
          <div className="flex flex-col text-start leading-none">
            <span
              className={`text-sm sm:text-xl font-extrabold tracking-tight text-[#0F0F0F] dark:text-white group-hover:text-[#FDB813] transition-colors ${
                lang === 'en' ? 'font-cinzel uppercase tracking-[0.12em]' : 'font-cairo'
              }`}
            >
              {t('brand.name')}
            </span>
            <span
              className="hidden sm:block text-[10px] font-cinzel-label text-[#525252] dark:text-[#FDB813] mt-1"
              dir="ltr"
            >
              SALAMIYAH CINEMA
            </span>
          </div>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label={t('nav.mainMenu')}
          className="hidden md:flex items-center gap-6 text-sm font-bold h-full"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className={`whitespace-nowrap shrink-0 h-full inline-flex items-center border-b-[3px] transition-colors ${
              currentPath === '/'
                ? 'border-[#FDB813] text-[#0F0F0F] dark:text-[#FDB813] font-extrabold'
                : 'border-transparent text-[#525252] dark:text-[#A3A3A3] hover:text-[#0F0F0F] dark:hover:text-[#FDB813]'
            }`}
          >
            {t('nav.home')}
          </a>
          <a
            href="/#movies"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/?section=movies');
            }}
            className={`whitespace-nowrap shrink-0 h-full inline-flex items-center border-b-[3px] transition-colors ${
              isMoviesSection || currentPath === '/?section=movies'
                ? 'border-[#FDB813] text-[#0F0F0F] dark:text-[#FDB813] font-extrabold'
                : 'border-transparent text-[#525252] dark:text-[#A3A3A3] hover:text-[#0F0F0F] dark:hover:text-[#FDB813]'
            }`}
          >
            {t('nav.movies')}
          </a>
          <a
            href="/#events"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/?section=events');
            }}
            className={`whitespace-nowrap shrink-0 h-full inline-flex items-center border-b-[3px] transition-colors ${
              isEventsSection || currentPath === '/?section=events'
                ? 'border-[#FDB813] text-[#0F0F0F] dark:text-[#FDB813] font-extrabold'
                : 'border-transparent text-[#525252] dark:text-[#A3A3A3] hover:text-[#0F0F0F] dark:hover:text-[#FDB813]'
            }`}
          >
            {t('nav.events')}
          </a>
          {user && (
            <a
              href="/bookings"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/bookings');
              }}
              className={`whitespace-nowrap shrink-0 h-full inline-flex items-center border-b-[3px] transition-colors ${
                currentPath.startsWith('/bookings')
                  ? 'border-[#FDB813] text-[#0F0F0F] dark:text-[#FDB813] font-extrabold'
                  : 'border-transparent text-[#525252] dark:text-[#A3A3A3] hover:text-[#0F0F0F] dark:hover:text-[#FDB813]'
              }`}
            >
              {t('nav.myBookings')}
            </a>
          )}
          {user?.role === UserRole.ADMIN && (
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/admin');
              }}
              className={`whitespace-nowrap shrink-0 h-full inline-flex items-center border-b-[3px] transition-colors ${
                isAdminSection
                  ? 'border-[#FDB813] text-[#0F0F0F] dark:text-[#FDB813] font-extrabold'
                  : 'border-transparent text-[#0F0F0F] dark:text-[#FDB813] hover:text-[#FFC940]'
              }`}
            >
              {t('nav.admin')}
            </a>
          )}
        </nav>

        {/* Zone 3: Language Toggle + Theme Toggle + User / Auth Action */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Role Switcher for immediate E2E testing of Badr's Auth & Admin Guard */}
          <div className="hidden xl:flex items-center">
            <label htmlFor="quick-role-select" className="sr-only">
              {t('nav.roleSwitcher')}
            </label>
            <select
              id="quick-role-select"
              aria-label={t('nav.roleSwitcher')}
              value={user ? user.role : 'GUEST'}
              onChange={(e) =>
                handleRoleSwitch(e.target.value as UserRole | 'GUEST')
              }
              className="rounded-[2px] border border-[#0F0F0F] dark:border-[#2E2E2E] bg-[#FFF8E7] dark:bg-[#141414] px-2.5 py-1.5 text-xs font-bold text-[#0F0F0F] dark:text-white focus:outline-none focus:border-[#FDB813] cursor-pointer"
            >
              <option value="GUEST">{t('nav.role.guest')}</option>
              <option value="CUSTOMER">{t('nav.role.customer')}</option>
              <option value="ADMIN">{t('nav.role.admin')}</option>
              <option value="STAFF">{t('nav.role.staff')}</option>
            </select>
          </div>

          {/* Bilingual Language Toggle (عربي | EN) right next to the Theme Toggle */}
          <LanguageToggle />

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? t('nav.theme.toLight')
                : t('nav.theme.toDark')
            }
            title={
              theme === 'dark'
                ? t('nav.theme.toLight')
                : t('nav.theme.toDark')
            }
            className="p-2 rounded-[2px] border border-[#0F0F0F] dark:border-[#2E2E2E] bg-[#FFF8E7] dark:bg-[#141414] text-[#0F0F0F] dark:text-[#FDB813] hover:border-[#FDB813] transition-colors cursor-pointer shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FDB813]" />
            ) : (
              <Moon className="w-4 h-4 text-[#0F0F0F]" />
            )}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F0F0F] dark:text-[#FDB813] max-w-[130px] truncate">
                {user.fullName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  toast({
                    variant: 'info',
                    title:
                      lang === 'en'
                        ? 'Signed out successfully'
                        : 'تم تسجيل الخروج بنجاح',
                  });
                  handleNav('/');
                }}
                aria-label={t('nav.logoutFull')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('nav.logout')}</span>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNav('/login')}
              >
                {t('nav.login')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleNav('/register')}
              >
                {t('nav.register')}
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={t('nav.mainMenu')}
            className="md:hidden p-2 rounded-[2px] border border-[#0F0F0F] dark:border-[#2E2E2E] bg-[#FFF8E7] dark:bg-[#141414] text-[#0F0F0F] dark:text-[#FDB813]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#0F0F0F]/20 dark:border-[#2E2E2E] bg-[#FFFDF7] dark:bg-[#141414] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className="text-start px-3 py-2.5 rounded-[2px] text-sm font-bold hover:bg-[#FDB813] hover:text-[#0F0F0F] transition-colors"
            >
              {t('nav.home')}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/?section=movies')}
              className="text-start px-3 py-2.5 rounded-[2px] text-sm font-bold hover:bg-[#FDB813] hover:text-[#0F0F0F] transition-colors"
            >
              {t('nav.movies')}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/?section=events')}
              className="text-start px-3 py-2.5 rounded-[2px] text-sm font-bold hover:bg-[#FDB813] hover:text-[#0F0F0F] transition-colors"
            >
              {t('nav.events')}
            </button>
            {user && (
              <button
                type="button"
                onClick={() => handleNav('/bookings')}
                className="text-start px-3 py-2.5 rounded-[2px] text-sm font-bold hover:bg-[#FDB813] hover:text-[#0F0F0F] flex items-center gap-2 transition-colors"
              >
                <Ticket className="w-4 h-4 text-[#FDB813]" />
                {t('nav.myBookings')}
              </button>
            )}
            {user?.role === UserRole.ADMIN && (
              <button
                type="button"
                onClick={() => handleNav('/admin')}
                className="text-start px-3 py-2.5 rounded-[2px] text-sm font-extrabold bg-[#FDB813] text-[#0F0F0F] flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {t('nav.admin')}
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-[#0F0F0F]/15 dark:border-[#2E2E2E] space-y-3">
            <div>
              <label
                htmlFor="mobile-role-select"
                className="block text-xs font-bold text-[#525252] dark:text-[#A3A3A3] mb-1 text-start"
              >
                {t('nav.roleSwitcher')}:
              </label>
              <select
                id="mobile-role-select"
                value={user ? user.role : 'GUEST'}
                onChange={(e) =>
                  handleRoleSwitch(e.target.value as UserRole | 'GUEST')
                }
                className="w-full rounded-[2px] border border-[#0F0F0F] dark:border-[#2E2E2E] bg-white dark:bg-[#0F0F0F] px-3 py-2 text-xs font-bold"
              >
                <option value="GUEST">{t('nav.role.guest')}</option>
                <option value="CUSTOMER">{t('nav.role.customer')}</option>
                <option value="ADMIN">{t('nav.role.admin')}</option>
                <option value="STAFF">{t('nav.role.staff')}</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <UserCheck className="w-4 h-4 text-[#FDB813]" />
                  <span>{user.fullName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    handleNav('/');
                  }}
                >
                  {t('nav.logoutFull')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNav('/login')}
                >
                  {t('nav.login')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNav('/register')}
                >
                  {t('nav.register')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { t } = useLanguage();

  return (
    <footer className="border-t-2 border-[#FDB813] bg-[#FFF8E7] dark:bg-[#0F0F0F] py-10 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-[#525252] dark:text-[#A3A3A3]">
        <div className="flex items-center gap-3.5 text-center sm:text-start">
          <img
            src={SALAMIYAH_LOGO_URL}
            alt={t('brand.name')}
            className="h-11 w-auto object-contain rounded-[2px] border border-[#0F0F0F] dark:border-[#FDB813]/50 hidden sm:block"
          />
          <div>
            <p className="font-extrabold text-[#0F0F0F] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <span>{t('brand.name')}</span>
              <span
                className="text-[11px] font-cinzel-label text-[#0F0F0F] dark:text-[#FDB813]"
                dir="ltr"
              >
                SALAMIYAH CINEMA
              </span>
            </p>
            <p className="text-xs mt-1">{t('brand.footerNote')}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs font-extrabold">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="hover:text-[#FDB813] transition-colors"
          >
            {t('nav.home')}
          </a>
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/login');
            }}
            className="hover:text-[#FDB813] transition-colors"
          >
            {t('nav.login')}
          </a>
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/admin');
            }}
            className="hover:text-[#FDB813] transition-colors"
          >
            {t('nav.admin')}
          </a>
        </div>
      </div>
    </footer>
  );
}



