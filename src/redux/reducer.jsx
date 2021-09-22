var Map = require("immutable").Map;
 
var reducer = function(state = Map(), action) {
  switch (action.type) {
    case "LOGIN_USER":
        return {...state, currentUser: action.payload};
    case "SIGNUP_USER":
        return {...state, currentUser: action.payload};
    case 'LOGOUT_USER':
        return {...state, currentUser: {} };
    default:
        return state;
  }
}
module.exports = reducer;