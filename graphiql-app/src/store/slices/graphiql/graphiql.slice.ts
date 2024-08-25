import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
interface graphiQlTypes {
    variables: {
        [key: string]: string;
    },
    query: string,
    headers: {
        [key: string]: string;
    },
    url: string,
    response: string

}
export const initialState: graphiQlTypes = {
    query: "",
    url:"",
    response: "",
    variables: {},
headers: {}

};

const graphiqlSlice = createSlice({
    name: "graphiql",
    initialState,
    reducers: {
       
        setGraphiQlValues(state, action: PayloadAction<graphiQlTypes>) {

        }
    },
});


export default graphiqlSlice.reducer;
