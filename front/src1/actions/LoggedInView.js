import { FETCH_ALL_SUCCESS, FETCH_ALL_REQUEST, FETCH_ALL_ERROR } from "../constants/action-types";

export function fetchAllData() {
  return {
    type: FETCH_ALL_REQUEST
  }
}

export function fetchAllDataSuccess(payload) {
  return {
    type: FETCH_ALL_SUCCESS,
    payload: payload
  }
}

export function fetchAllDataError() {
  return {
    type: FETCH_ALL_ERROR
  }
}
