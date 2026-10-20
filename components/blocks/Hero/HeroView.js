import { ButtonsView } from "../Buttons/ButtonsView";
import { getLayoutProps } from '../../../helpers';

export function HeroView({ heading, preamble, type, buttons, layoutOptions }) {
  const layoutProps = getLayoutProps(layoutOptions || {});
  
  return (
    <div {...layoutProps.attributes} style={layoutProps.styles} className={layoutProps.classNames.join(' ')}>
      <h1>{heading}</h1>
      <p>{preamble}</p>
      <div>
        <ButtonsView buttons={buttons} />
      </div>
    </div>
  );
}