'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  const params = useParams<{ lang?: string }>();
  // Безопасное получение словаря с фоллбэком
  const dict = getUiDictionary(params?.lang) || {
    ui: {
      header: {
        nav: {
          home: 'Главная',
          about: 'О нас',
          segments: 'Сегменты',
          products: 'Продукция',
          news: 'Новости',
          contacts: 'Контакты'
        },
        contactButton: 'Связаться'
      }
    }
  };
  
  const locale = params?.lang ?? 'ru';
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: dict.ui.header.nav.home },
    { label: dict.ui.header.nav.about },
    { label: dict.ui.header.nav.segments },
    { label: dict.ui.header.nav.products },
    { label: dict.ui.header.nav.news, href: `/${locale}/news` },
    { label: dict.ui.header.nav.contacts, href: `/${locale}/contacts` },
  ];

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.root}>
      {/* Верхняя плашка (Всегда видна) */}
      <div className={styles.inner}>
        <div className={styles.contentContainer}>
          <button type="button" className={styles.logoButton} aria-label="IMPEKS logo">
            <Image 
              src="/logo.png" 
              alt="ТД ИМПЭКС" 
              width={196} 
              height={44} 
              className={styles.logo} 
              priority 
            />
          </button>

          {/* Десктопное меню */}
          <div className={styles.desktopRight}>
            <nav className={styles.navDesktop}>
              {navItems.map((item) =>
                item.href ? (
                  <Link key={item.label} href={item.href} className={styles.navButton}>
                    {item.label}
                  </Link>
                ) : (
                  <button key={item.label} type="button" className={styles.navButton}>
                    {item.label}
                  </button>
                ),
              )}

              <button type="button" className={styles.contactButton}>
              <span>{dict.ui.header.contactButton}</span>
              <Image src="/telegram.svg" alt="Telegram" width={18} height={18} />
            </button>
            </nav>
            
          </div>

          {/* Кнопка Бургер / Крестик */}
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

      {/* Выпадающее меню (Часть хедера) */}
      <div className={`${styles.mobileDropdown} ${menuOpen ? styles.mobileDropdownOpen : ''}`}>
        <nav className={styles.mobileNavContent}>
          {navItems.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className={styles.mobileLink} onClick={closeMenu}>
                {item.label}
              </Link>
            ) : (
              <button key={item.label} type="button" className={styles.mobileLink} onClick={closeMenu}>
                {item.label}
              </button>
            ),
          )}
          
          {/* Мобильная кнопка связи (компактная) */}
          <button 
            type="button" 
            className={styles.contactButton} 
            onClick={closeMenu}
            style={{ marginTop: '10px' }}
          >
            <span>{dict.ui.header.contactButton}</span>
            <Image src="/telegram.svg" alt="Telegram" width={18} height={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}
