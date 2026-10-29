import dynamic from 'next/dynamic';

const frontPage = dynamic(() => import('./front-page.js'));
const page = dynamic(() => import('./page.js'));
const single = dynamic(() => import('./single.js'));
const workPost = dynamic(() => import('./single-work.js'));

const templates = {
    'front-page': frontPage,
    'single-work': workPost,
    page,
    single,
};

export default templates;
