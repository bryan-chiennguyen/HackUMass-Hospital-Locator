import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Umass winning team'
	}
});

export default app;