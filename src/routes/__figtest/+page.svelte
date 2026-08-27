<script>
	import Legend from '$lib/components/Legend.svelte';
</script>

<div style="padding: 1.25rem;">
	<Legend
		variant="bivariate"
		unit="inhab/km²"
		ticks={['0', '5', '25', '250', '1.000', '50.000', '100.000']}
		rows={[
			{
				label: 'Areas of higher hazard',
				colors: ['#ffffff', '#f6e8c8', '#f2d3c7', '#e3a491', '#cf7a68', '#a5473a', '#5a1e14']
			},
			{
				label: 'Areas of lower hazard',
				colors: ['#ffffff', '#e6e6e6', '#cccccc', '#9a9a9a', '#6b6b6b', '#333333', '#000000']
			}
		]}
	/>
</div>
