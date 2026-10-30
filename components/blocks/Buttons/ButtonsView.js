import { getLayoutProps } from '../../../helpers';

export function ButtonsView({ buttons, layoutOptions, isChild, blockSlug }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);

    return (
        <div {...layoutProps.attributes} style={layoutProps.styles} className={layoutProps.classNames.join(' ')}>
            {Array.isArray(buttons) &&
                buttons
                    .filter((button) => button?.link?.url)
                    .map(({ link }) => (
                        <a
                            key={link.url}
                            href={link.url}
                            {...(link.target && { target: link.target })}
                            rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}>
                            {link.title}
                        </a>
                    ))}
        </div>
    );
}
