const LOCAL_API = 'http://localhost:8099';

export const BASE_URL = LOCAL_API;

export const API_ENDPOINTS = {
  GET_ALL_STUDENTS: '/student/all',
  GET_STUDENT: '/student',
  CREATE_STUDENT: '/student/create',
  UPDATE_STUDENT: '/student/update',
  DELETE_STUDENT: '/student/delete',
  PHOTO_UPLOAD: '/student/upload',

  GENERATE_STUDENTS: '/excel/generate',
  GET_FILES: '/excel/list',
  DOWNLOAD_FILE: '/excel/download',

  LOGIN: '/auth/login',
};
