export const NavToggleButton = ({isNavShown, setIsNavShown}) => {
    return (
        <button
            type="button"
            className="nav-toggle"
            onClick={() => setIsNavShown(!isNavShown)}
            aria-label="Toggle navigation"
            aria-controls="primary-navigation"
            aria-expanded={isNavShown}>
            ☰
        </button>
    );
};
