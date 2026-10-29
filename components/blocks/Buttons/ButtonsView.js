import { getLayoutProps } from '../../../helpers';

export function ButtonsView({ buttons, layoutOptions, isChild, blockSlug }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);

    return (
        <div {...layoutProps.attributes} style={layoutProps.styles} className={layoutProps.classNames.join(' ')}>
            {Array.isArray(buttons) &&
                buttons.map((button) => (
                    <a
                        key={button.link.url}
                        href={button.link.url}
                        {...(button.link.target && { target: button.link.target })}
                        rel={button.link.target === '_blank' ? 'noopener noreferrer' : undefined}>
                        {button.link.title}
                    </a>
                ))}
        </div>
    );
}
