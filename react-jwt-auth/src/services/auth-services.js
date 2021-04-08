import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

class AuthService {
  login(username, password) {
    console.log(username);
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((respone) => {
        console.log(respone);
        if (respone.data.accessToken) {
          localStorage.setItem("SockIM_user", JSON.stringify(respone.data));
        }
        return respone.data;
      });
  }

  logout() {
    localStorage.removeItem("SockIM_user");
  }

  register(username, email, password, role = "user") {
    console.log("[REGISTER] ", username);
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("SockIM_user"));
  }
}

export default new AuthService();
