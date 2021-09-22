// const server = "http://192.168.88.177:3001"
const server = "http://192.168.0.100:3001"

const userLoginPostFetch = function(user) {
  return dispatch => {
    return fetch(server + "/auth/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(user)
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          //Тут прописываем логику
          alert(data.message)
        } else {
          localStorage.setItem("token", data.token)
          dispatch(loginUser(data))
          // alert("Вы вошли в систему")
          window.location.href = "/profile"
        }
      })
  }
}

const userSignupPostFetch = function(user) {
  return dispatch => {
    return fetch(server + "/auth/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(user)
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          //Тут прописываем логику
          alert(data.message)
        } else {
          localStorage.setItem("token", data.token)
          dispatch(signupUser(data))
          alert("Регистрация прошла успешно")
          window.location.href = "/"
        }
      })
  }
}

const getProfileFetch = () => {
  return dispatch => {
    const token = localStorage.token;
    if (token) {
      return fetch(server + "/profile/get", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Auth': `${token}`
        },
        data:{
          token:localStorage.token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          // console.log('getProfileFetch', data)
          if (data.message) {
            // Будет ошибка если token не дествительный
            localStorage.removeItem("token")
          } else {
            dispatch(loginUser(data))
          }
        })
    }
  }
}

const logoutUser = () => ({
  type: 'LOGOUT_USER'
})

const loginUser = userObj => ({
  type: 'LOGIN_USER',
  payload: userObj
})

const signupUser = userObj => ({
  type: 'SIGNUP_USER',
  payload: userObj
})


module.exports = {userLoginPostFetch, userSignupPostFetch, getProfileFetch, logoutUser};