import { useState } from 'react';
// import classNames from 'classnames/bind';
import Link from 'next/link';
import { NavigationMenu } from '@/components/NavigationMenu';
// import styles from './Header.module.scss';

// let cx = classNames.bind(styles);

export default function Header({
  title = 'Headless by WP Engine',
  description,
  menuItems
}) {
  const [isNavShown, setIsNavShown] = useState(false);

  return (
    <header className="header">
      <div className="navbar">
        <div className="brand">
          <Link href="/" className="title" dangerouslySetInnerHTML={{ __html: title }} />
          {description && <p className="description">{description}</p>}
        </div>
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setIsNavShown(!isNavShown)}
          aria-label="Toggle navigation"
          aria-controls="primary-navigation"
          aria-expanded={isNavShown}
        >
          ☰
        </button>
        <NavigationMenu
          className={['primary-navigation', isNavShown ? 'show' : undefined].join(' ')}
          menuItems={menuItems}
        />
    </div>
  </header>
  );
}
