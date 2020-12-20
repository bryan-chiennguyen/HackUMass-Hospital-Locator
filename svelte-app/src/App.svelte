<script>
	import Navbar from './Navbar.svelte';
<<<<<<< HEAD
	import Map from './map.svelte'
	//export let name;
	export let ready;
</script>

<svelte:head>
	<script defer async
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCo3l2gDAT_SeGV20UtefK_ERRZ_tHygS0
	&callback=initMap">
	</script>
</svelte:head>

<main id="content">
	<div id="left">
		<Navbar/>
	</div>
	<div id="right">
		{ #if ready }
		<Map/>
		{ /if } 
	</div>
=======
	import Radar_io from './Radar_io.svelte'
	export let name;
</script>

<main>
	<Navbar/>
	<Radar_io/>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
>>>>>>> e436fba60255b5c15e6a7b639494f57bf0c2e658
</main>

<style>
	:global(body) {
		background-color:beige;
	}
	
	main {
		/*text-align: center;*/
		padding: 1em;
		max-width: 240px;
		/*margin: 0 auto;*/
	}

	h1 {
		color: #ff3e00;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	#content {
		/*border: 1px solid black;*/
	}

	#content > div {
		height: 100px;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
	}

	#left {
		float: left;
		width: 30%;
		border-right: 1px solid black;
	}

	#right {
		float: right;
		width: 70%;
	}
</style>