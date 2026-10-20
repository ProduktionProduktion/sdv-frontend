import { getLayoutProps } from '../../../helpers';

export function ButtonsView({ buttons, layoutOptions }) {
  const layoutProps = getLayoutProps(layoutOptions || {});

  return (
    <div {...layoutProps.attributes} style={layoutProps.styles} className={layoutProps.classNames.join(' ')}>
      {buttons.map((button) => (
        <a key={button.link.url} href={button.link.url} {...(button.link.target && {target: button.link.target})} rel={button.link.target === '_blank' ? 'noopener noreferrer' : undefined}>
          {button.link.title}
        </a>
      ))}
    </div>
  );
}