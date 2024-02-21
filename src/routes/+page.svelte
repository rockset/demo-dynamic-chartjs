<script lang="ts">
	import Chart from 'chart.js/auto';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let labelField = '';
	let valueField = '';

	let chartEl: HTMLCanvasElement | undefined;
	let chart: Chart | null = null;
	let error: string | null = null;

	// Show in the console what we're retreiving from the server
	$: console.log(data);

	// Infer the schema from all documents
	$: allKeysWithDuplicates = data.response?.flatMap((obj: any) => [...Object.keys(obj)]) ?? [];
	$: validKeys = [...new Set<string>(allKeysWithDuplicates)];
	$: stringKeys = [...validKeys].filter((key) =>
		data.response?.some((data) => typeof data[key] === 'string')
	);
	$: numberKeys = [...validKeys].filter((key) =>
		data.response?.some((data) => typeof data[key] === 'number')
	);

	// Choose the first string key and number key by default
	$: if (stringKeys.length > 0 && !labelField) {
		labelField = stringKeys[0];
	}
	$: if (numberKeys.length > 0 && !valueField) {
		valueField = numberKeys[0];
	}

	// Show an error if our data is invalid or there was an error loading
	$: labelField, valueField, data, (error = verifyData());

	// Render the chart if we're valid
	$: if (!error && chartEl && labelField && valueField && data.response) {
		renderChart(chartEl);
	}

	function verifyData() {
		if (data.error) return `Error loading data: ${data.error}`;
		if (!data.response) return 'Data loading...';
		if (!labelField) {
			return 'Please select a label field.';
		}
		if (!valueField) {
			return 'Please select a value field.';
		}
		return null;
	}

	function renderChart(el: HTMLCanvasElement) {
		chart?.destroy();

		try {
			const results =
				data.response
					?.map((data) => ({
						label: data[labelField],
						value: data[valueField]
					}))
					.filter(({ label, value }) => typeof label === 'string' && typeof value === 'number') ??
				[];

			chart = new Chart(el, {
				type: 'bar',
				data: {
					labels: results.map((res) => res.label),
					datasets: [
						{
							label: 'Tweet Count',
							data: results.map((res) => res.value)
						}
					]
				},
				options: {
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});
			error = '';
		} catch (e) {
			console.warn(e);
			error = 'Error rendering chart!';
		}
	}
</script>

<svelte:head>
	<title>Rockset Chart.js Demo</title>
</svelte:head>

<!-- Render dropdowns -->
{#if data.response?.[0]}
	<div style="margin: 1rem;">
		<label>
			Label field:
			<select bind:value={labelField}>
				{#if !labelField}
					<option value="" disabled>Select...</option>
				{/if}

				{#each stringKeys as key}
					<option value={key}>{key}</option>
				{/each}
			</select>
		</label>

		<label>
			Value field:
			<select bind:value={valueField}>
				{#if !valueField}
					<option value="" disabled>Select...</option>
				{/if}

				{#each numberKeys as key}
					<option value={key}>{key}</option>
				{/each}
			</select>
		</label>
	</div>
{/if}

<!-- Render chart or error -->
{#if !error}
	<div style="width: 100%; display: flex; justify-content: center">
		<div style="width: 90vw; display: flex; justify-content: center">
			<canvas bind:this={chartEl} />
		</div>
	</div>
{:else}
	<p style="color: red;">
		{error}
	</p>
{/if}
