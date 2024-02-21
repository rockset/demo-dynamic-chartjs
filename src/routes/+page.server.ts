/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	QUERY_LAMBDA_NAME,
	QUERY_LAMBDA_TAG,
	ROCKSET_API_KEY,
	WORKSPACE
} from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const res = await fetch(
			`https://api.usw2a1.rockset.com/v1/orgs/self/ws/${WORKSPACE}/lambdas/${QUERY_LAMBDA_NAME}/tags/${QUERY_LAMBDA_TAG}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `ApiKey ${ROCKSET_API_KEY}`
				}
			}
		).then((response) => response.json());

		if (res.message) {
			return {
				response: null,
				error: res.message
			};
		}
		return {
			response: res.results as Array<Record<string, any>>,
			error: null
		};
	} catch (e) {
		return {
			response: null,
			error: String(e)
		};
	}
};
