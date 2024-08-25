import { RootState } from '../../store';

export const graphiqlResponseSelector = (state: RootState) => {
	const graphiQlResponse = state.graphiqlSlice
	return graphiQlResponse.response
};