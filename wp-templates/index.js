/**
 * Static imports: Faust's WordPressTemplate renders nothing during SSR for dynamic() templates,
 * which would leave crawlers without content or meta tags.
 */
import frontPage from './front-page.js';
import page from './page.js';
import single from './single.js';
import workPost from './single-work.js';
import eventPost from './single-event.js';

const templates = {
    'front-page': frontPage,
    'single-work': workPost,
    'single-event': eventPost,
    page,
    single,
};

export default templates;
