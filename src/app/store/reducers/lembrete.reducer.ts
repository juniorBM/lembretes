import { addLembrete, setAllLembretes } from './../actions/lembrete.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const lembreteFeatureKey = 'lembrete';

export interface State {}

// export const initialState: State = {};
export const initialState: State = {};

export const lembreteReducer = createReducer(
  initialState,
  on(setAllLembretes, (state, { payload }) => {
    state = { ...state, lembretes: payload };
    return state;
  }),
  on(addLembrete, (state: any, {payload}) => {

    let newState = [...state.lembretes, payload];

    return newState;
  })
);
