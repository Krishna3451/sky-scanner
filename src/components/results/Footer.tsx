'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const links = {
    help: ['Help', 'Privacy Settings', 'Log in'],
    cookies: ['Cookie policy', 'Privacy policy', 'Terms of service', 'Company Details'],
    explore: ['Explore', 'Company', 'Partners', 'Trips', 'International Sites'],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.langSelector}>
          <span className={styles.flag}>🇮🇳</span> India - EN (₹)
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Help</h4>
            <ul>
              {links.help.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Cookie policy</h4>
            <ul>
              {links.cookies.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Explore</h4>
            <ul>
              {links.explore.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>© Skyscanner Ltd 2002 – 2026</p>
      </div>
    </footer>
  );
}
