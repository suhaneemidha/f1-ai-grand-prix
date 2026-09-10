interface HeaderProps {
  active?: 'home' | 'levels' | 'algorithms' | 'about';
  onNavigate?: (
    page: 'home' | 'levels' | 'algorithms' | 'about',
  ) => void;
}

export function Header({
  active,
  onNavigate,
}: HeaderProps) {
  const handleNavigate = (
    page: 'home' | 'levels' | 'algorithms' | 'about',
  ) => {
    onNavigate?.(page);
  };

  return (
    <header className="site-header">
      <button
        className="site-header__brand"
        onClick={() => handleNavigate('home')}
        aria-label="Go to home"
      >
        <img
          className="site-header__mark"
          src="https://commons.wikimedia.org/wiki/Special:Redirect/file/F1.svg"
          alt="Formula 1"
        />

        <span className="site-header__title">
          AI GRAND PRIX
        </span>
      </button>

      <nav className="site-header__nav">
        <button
          className={active === 'home' ? 'active' : ''}
          onClick={() => handleNavigate('home')}
        >
          Home
        </button>

        <button
          className={active === 'levels' ? 'active' : ''}
          onClick={() => handleNavigate('levels')}
        >
          Levels
        </button>

        <button
          className={active === 'algorithms' ? 'active' : ''}
          onClick={() => handleNavigate('algorithms')}
        >
          Algorithms
        </button>

        <button
          className={active === 'about' ? 'active' : ''}
          onClick={() => handleNavigate('about')}
        >
          About
        </button>
      </nav>
    </header>
  );
}