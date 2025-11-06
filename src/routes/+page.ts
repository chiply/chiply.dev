import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// grab the data here
// NOTE cannote be client side rendered, you will get this error:
// Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in:
// file and data are supported by the default ESM loader. Received
// protocol 'https:'
// TODO should figure out how to make this server side rendered...
export const ssr = false;
export const load: PageLoad = async () => {
  let homepage = await import(`./index.html?url&raw`);

  return {
	homepage: homepage.default,
  };

  error(404, 'Not found');
};
