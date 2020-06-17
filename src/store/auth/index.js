import { createAction, createReducer } from '@reduxjs/toolkit';

// Reducer para validar se o usuário esta ou não autenticado
const INITIAL_STATE = {
  isAuthenticated: false,
};

export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');

export default createReducer(INITIAL_STATE, {
  [login.type]: (state) => ({ ...state, isAuthenticated: true, }),
  [logout.type]: (state) => ({ ...state, isAuthenticated: false}),
});