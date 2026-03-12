'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import { scrollToSection } from '@/lib/scroll-to-section';
import styles from './SiteHeader.module.css';

type NavItem =
  | { label: string; kind: 'anchor'; target: 'top' | 'about' | 'segments' | 'products' }
  | { label: string; kind: 'route'; href: string };

export default function SiteHeader() {
  const params = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const localeFromParams = params?.lang;
  const localeFromPath = pathname.split('/').filter(Boolean)[0];
  const locale: Locale = localeFromParams && isValidLocale(localeFromParams)
    ? localeFromParams
    : localeFromPath && isValidLocale(localeFromPath)
      ? localeFromPath
      : i18n.defaultLocale;
  const dict = getUiDictionary(locale);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  const homePath = `/${locale}`;

  const navItems: NavItem[] = [
    { label: dict.ui.header.nav.home, kind: 'anchor', target: 'top' },
    { label: dict.ui.header.nav.about, kind: 'anchor', target: 'about' },
    { label: dict.ui.header.nav.segments, kind: 'anchor', target: 'segments' },
    { label: dict.ui.header.nav.products, kind: 'anchor', target: 'products' },
    { label: dict.ui.header.nav.news, kind: 'route', href: `/${locale}/news` },
    { label: dict.ui.header.nav.contacts, kind: 'route', href: `/${locale}/contacts` },
  ];

  const closeMenu = () => setMenuOpen(false);

  const getLocaleLink = (targetLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return `/${targetLocale}`;
    }
    if (i18n.locales.includes(segments[0] as Locale)) {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }
    return `/${segments.join('/')}`;
  };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!langRef.current) {
        return;
      }
      if (!langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const handleAnchorNavigation = (target: NavItem & { kind: 'anchor' }) => {
    closeMenu();

    if (pathname !== homePath) {
      router.push(`${homePath}#${target.target}`);
      return;
    }

    scrollToSection(target.target);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={styles.root}>
      <div className={`${styles.inner} ${menuOpen ? styles.innerMenuOpen : ''}`}>
        <div className={styles.contentContainer}>
          <button type="button" className={styles.logoButton} aria-label="IMPEKS logo" onClick={() => handleAnchorNavigation({ label: '', kind: 'anchor', target: 'top' })}>
            <Image src="/logo.png" alt='ТД "ИМПЭКС"' width={196} height={44} className={styles.logo} priority />
          </button>

          <div className={styles.desktopRight}>
            <nav className={styles.navDesktop}>
              {navItems.map((item) =>
                item.kind === 'route' ? (
                  <Link key={item.label} href={item.href} className={styles.navButton} onClick={closeMenu}>
                    {item.label}
                  </Link>
                ) : (
                  <button key={item.label} type="button" className={styles.navButton} onClick={() => handleAnchorNavigation(item)}>
                    {item.label}
                  </button>
                ),
              )}

              <div className={styles.langDropdown} ref={langRef}>
                <button
                  type="button"
                  className={langOpen ? `${styles.langTrigger} ${styles.langTriggerOpen}` : styles.langTrigger}
                  onClick={() => setLangOpen((prev) => !prev)}
                  aria-expanded={langOpen}
                >
                  <span>{locale.toUpperCase()}</span>
                  <Image src="/icons/translate.svg" alt="" width={20} height={20} className={styles.langIcon} aria-hidden />
                </button>
                <div className={`${styles.langMenu} ${langOpen ? styles.langMenuOpen : ''}`}>
                  {i18n.locales
                    .filter((item) => item !== locale)
                    .map((item) => (
                      <Link key={item} href={getLocaleLink(item)} className={styles.langOption} onClick={() => setLangOpen(false)}>
                        {item.toUpperCase()}
                      </Link>
                    ))}
                </div>
              </div>

              <a href="mailto:tdimpeks@support.com" className={styles.contactButton}>
                <span>{dict.ui.header.contactButton}</span>
                <Image src="/icons/mailbox2.svg" alt="mail" className={styles.btnIcon} width={18} height={18} />
              </a>
            </nav>
          </div>

          <button
            type="button"
            className={styles.menuToggle}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <span className={styles.menuCloseIcon}>✕</span>
            ) : (
              <div className={styles.menuLines}>
                <span />
                <span />
                <span />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className={`${styles.mobileDropdown} ${menuOpen ? styles.mobileDropdownOpen : ''}`}>
        <nav className={styles.mobileNavContent}>
          {navItems.map((item) =>
            item.kind === 'route' ? (
              <Link key={item.label} href={item.href} className={styles.mobileLink} onClick={closeMenu}>
                {item.label}
              </Link>
            ) : (
              <button key={item.label} type="button" className={styles.mobileLink} onClick={() => handleAnchorNavigation(item)}>
                {item.label}
              </button>
            ),
          )}

          <div className={styles.mobileLangs}>
            {i18n.locales.map((item) => (
              <Link
                key={item}
                href={getLocaleLink(item)}
                className={item === locale ? `${styles.mobileLangLink} ${styles.mobileLangLinkActive}` : styles.mobileLangLink}
                onClick={closeMenu}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>

          <a href="mailto:tdimpeks@support.com" className={styles.contactButtonmobile} style={{ marginTop: '10px' }}>
            <span>{dict.ui.header.contactButton}</span>
              <Image src="/icons/mailbox2.svg" alt="mail" className={styles.btnIcon} width={20} height={20} />
          </a>
        </nav>
      </div>
    </header>
  );
}
