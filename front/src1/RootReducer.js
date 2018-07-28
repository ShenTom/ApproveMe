import { FETCH_ALL_SUCCESS, FETCH_ALL_REQUEST, FETCH_ALL_ERROR } from "./constants/action-types";


const initialState = {
  data: {
    channels:[],
    groups: [],
    user_id: 0
  }
};

const RootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_REQUEST:
      return { ...state};
    case FETCH_ALL_SUCCESS:
      return { ...state, data: action.payload};
    case FETCH_ALL_ERROR:
      return { ...state};
    default:
      return state;
  }
};

export default RootReducer;
