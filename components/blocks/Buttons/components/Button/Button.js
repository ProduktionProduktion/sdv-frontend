const first = (value) => (Array.isArray(value) ? value[0] : value);

function getLuminance(color) {
    const hex = color?.replace('#', '');

    if (!hex || !/^[0-9a-f]{6}$/i.test(hex)) {
        return null;
    }

    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));

    return (r + g + b) / (255 * 3);
}

export function Button({
    link,
    color,
    size,
    style,
    classNames = { button: 'button', outline: 'outline', solid: 'solid', sm: 'sm', lg: 'lg' },
    LinkComponent = 'a',
}) {
    const buttonSize = first(size);
    const buttonStyle = first(style) || 'outline';
    const luminance = getLuminance(color);
    // const className = [classNames.button, classNames[buttonStyle], buttonSize !== 'default' && classNames[buttonSize]]
    const className = ['button', buttonStyle, buttonSize !== 'default' && buttonSize].filter(Boolean).join(' ');
    const inlineStyles = {
        ...(color && { '--btn-color': color }),
        ...(luminance !== null && { '--btn-text-color': luminance < 0.5 ? 'var(--background)' : 'var(--foreground)' }),
    };

    return (
        <LinkComponent
            href={link.url}
            className={className}
            style={inlineStyles}
            {...(link.target && { target: link.target })}
            rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}>
            {link.title}
        </LinkComponent>
    );
}
