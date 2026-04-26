/**
 * api/auth.js
 * Auth API calls — register, login, getMe
 */

import axiosClient from './axiosClient';

const normalizeAuthPayload = (payload) => {
  const root = payload?.data ?? payload ?? {};
  return {
    token: root.token,
    user: root.user,
  };
};

export const registerUser = (data) =>
  axiosClient.post('/auth/register', data).then((r) => normalizeAuthPayload(r.data));

export const loginUser = (data) =>
  axiosClient.post('/auth/login', data).then((r) => normalizeAuthPayload(r.data));

export const getMe = () =>
  axiosClient.get('/auth/me').then((r) => {
    const payload = r.data?.data ?? r.data;
    return payload?.user ?? payload;
  });
