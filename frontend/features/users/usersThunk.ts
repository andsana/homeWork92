import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { unsetUser } from './usersSlice';
import {GlobalError, LoginMutation, RegisterMutation, RegisterResponse, ValidationError} from "../../src/types";
import { RootState } from '../../src/app/store';

export const register = createAsyncThunk<
    RegisterResponse,
    RegisterMutation,
    { rejectValue: ValidationError }
>('users/register', async (registerMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post('/users', registerMutation);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 422) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const login = createAsyncThunk<
    RegisterResponse,
    LoginMutation,
    { rejectValue: GlobalError }
>('users/login', async (loginMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>(
        '/users/sessions',
        loginMutation,
    );
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 422) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const logout = createAsyncThunk<void, undefined, { state: RootState }>(
    'users/logout',
    async (_, { getState, dispatch }) => {
      const token = getState().users.user?.token;
      await axiosApi.delete('/users/sessions', {
        headers: { Authorization: 'Bearer ' + token },
      });
      dispatch(unsetUser());
    },
);
