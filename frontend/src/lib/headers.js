import Cookies from 'js-cookie'
const csrftoken = Cookies.get('csrftoken')
// const csrftoken = undefined

export const headers = {
  common: {
    'X-CSRF-TOKEN': csrftoken
  }
}
  // later on you can include this (remember to import it)
  // headers: { Authorization: `Bearer ${getToken()}` } 
