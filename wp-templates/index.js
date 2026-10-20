import dynamic from 'next/dynamic';

const frontPage = dynamic(() => import('./front-page.js'));
const page = dynamic(() => import('./page.js'));
const single = dynamic(() => import('./single.js'));

const templates = {
	'front-page': frontPage,
	page,
	single,
};

export default templates;
