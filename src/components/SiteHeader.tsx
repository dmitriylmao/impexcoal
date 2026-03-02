'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import { scrollToSection } from '@/lib/scroll-to-section';
import styles from './SiteHeader.module.css';

type NavItem =
  | { label: string; kind: 'anchor'; target: 'top' | 'about' | 'segments' | 'products' }
  | { label: string; kind: 'route'; href: string };

export default function SiteHeader() {
  const params = useParams<{ lang?: string }>();
  const dict = getUiDictionary(params?.lang);
  const locale = params?.lang ?? 'ru';
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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

              <button type="button" className={styles.contactButton}>
                <span>{dict.ui.header.contactButton}</span>
                <Image src="/icons/mailbox2.svg" alt="mail" className={styles.btnIcon} width={20} height={20} />
              </button>
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

          <button type="button" className={styles.contactButtonmobile} style={{ marginTop: '10px' }}>
            <span>{dict.ui.header.contactButton}</span>
              <Image src="/icons/mailbox2.svg" alt="mail" className={styles.btnIcon} width={20} height={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}
