import { Lembrete, Lembretes } from './../../models/lembrete';
import { createAction, props } from '@ngrx/store';


enum ActionTypes {
  Increment = 'Increment',
  Decrement = 'Decrement',
}

export const loadLembretes = createAction(
  '[Lembrete] Load Lembretes'
);

export const setAllLembretes = createAction(
  'setAllLembretes',
  props<{ payload: Lembretes }>()
);

export const addLembrete = createAction(
  'addLembrete',
  props<{ payload: Lembrete }>()
);
export const loadLembretesFailure = createAction(
  '[Lembrete] Load Lembretes Failure',
  props<{ error: any }>()
);
