import React, { Component } from "react";
import UserService from "../services/user-services";
import AuthService from "../services/auth-services";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      endpoint: "ws://localhost:55555",
      msgs: [],
      ws: null,
      onlineuserlist: [],
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({ currentUser: user });
      const ws = new WebSocket(this.state.endpoint);

      this.setState({ ws });

      ws.onopen = () => {
        console.log("WS Connected");
        const payload = {
          type: "onconnect",
          username: this.state.currentUser.username,
        };
        ws.send(JSON.stringify(payload));
      };

      ws.onclose = () => {
        // ws.send(JSON.stringify({ type: "close" }));
        console.log("CLOSE CLIENT");
      };

      ws.onmessage = ({ data }) => {
        data = JSON.parse(data);
        const type = data.type;
        console.log(data.userlist);
        if (type === "updateUserList") {
          this.setState({ onlineuserlist: data.userlist });
        }
      };
    }

    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    const { id } = this.state.onlineuserlist;
    console.log("this.state.onlineuserlist", this.state.onlineuserlist);

    return (
      <div>
        {console.log("RENDER", id)}
        <h2>ONLINE USERS</h2>

        {/* <ol>
          {this.state.onlineuserlist.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ol> */}
      </div>
    );
  }
}
