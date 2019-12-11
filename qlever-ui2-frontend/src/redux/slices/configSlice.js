import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    autoExecute: false
}

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setAutoExecute: {
            reducer: (state, { payload: { autoExecute } }) => ({
                ...state,
                autoExecute
            }),
            prepare: autoExecute => ({ payload: { autoExecute } })
        }
    }
})

export const { setAutoExecute } = configSlice.actions
export default configSlice.reducer
