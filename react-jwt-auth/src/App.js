import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";

import AuthService from "./services/auth-services";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";

class App extends Component {
  constructor(props) {
    console.log("[APP : constructor]");
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showAdminBoard } = this.state;

    return (
      <div>
        {console.log(this.state)}
        <nav>
          <div>
            <li>
              <Link to={"/home"}>Home</Link>
            </li>

            {showAdminBoard && (
              <li>
                <Link to={"/admin"}>Admin Board</Link>
              </li>
            )}

            {currentUser && (
              <li>
                <Link to={"/user"}>User</Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div>
              <li>
                <Link to={"/profile"}>{currentUser.username}</Link>
              </li>
              <li>
                <a href="/login" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div>
              <li>
                <Link to={"/login"}>Login</Link>
              </li>

              <li>
                <Link to={"/register"}>Sign Up</Link>
              </li>
            </div>
          )}
        </nav>

        <div>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/admin" component={BoardAdmin} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
