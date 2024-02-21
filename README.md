# Rockset x Sveltekit Demo

A quick demo that dynamically renders a Charts.js chart with data sourced from a Rockset Query Lambda!

It will load your data from Rockset, analyze its response to find a schema,
and present drop-downs that allow you to select which field to use as your
label and value (the former of which must be a string, the latter a number).

It will then render a bar chart based on this data!

## Setup

```bash
# Download dependencies
npm install

# Add your API key to .env so we can access the query lambda
echo "ROCKSET_API_KEY=$YOUR_API_KEY" >> .env

# Point to your Query Lambda
echo "WORKSPACE=$YOUR_QUERY_LAMBDA_WORKSPACE" >> .env
echo "QUERY_LAMBDA_NAME=$YOUR_QUERY_LAMBDA_NAME" >> .env

# replace latest with another tag if you wish
echo "QUERY_LAMBDA_TAG=latest" >> .env
```

## Running the Demo

```bash
npm run dev -- --open
```
