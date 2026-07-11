import styles from './Footer.module.css';

const TECH_STACK = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'TanStack Query',
  'Zustand',
  'Gemini API',
  'Vitest',
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.stack}>
        {TECH_STACK.map((tech) => (
          <span key={tech} className={styles.badge}>
            {tech}
          </span>
        ))}
      </div>
      <p className={styles.credit}>
        Built by Kostandinos Vasili · Live data via Binance API
      </p>
    </footer>
  );
}