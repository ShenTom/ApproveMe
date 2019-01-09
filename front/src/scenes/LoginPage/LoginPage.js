import React, { Component } from "react";
import "./LoginPage.css";
class LoginPage extends Component {
  constructor(props) {
    super(props);
  }

  getCode(str) {
    let result = str;
    const len = result.length;
    result = result.slice(6, len - 7);
    return result;
  }

  //   async login(code) {
  //     const client_id = "247985127878.297865106401";
  //     const client_secret = "4087f5cdbfc9c648597d420252e403d5";

  //     let url = `https://slack.com/api/oauth.access?client_id=${client_id}&client_secret=${client_secret}&code=${code}`;
  //     console.log(url);
  //     const res = await fetch(url);
  //     const resJson = await res.json();
  //     console.log(resJson);
  //     if (resJson.ok) {
  //       console.log("login successful");

  //       const key = resJson.access_token;
  //       this.props.history.push({
  //         pathname: "/",
  //         state: { token: key, isLoggedIn: true, user_id: resJson.user_id }
  //       });
  //     }
  //   }

  render() {
    // const n = this.props.location.search;
    // const scope = "read";
    // if (n) {
    //   console.log("logged in");
    //   const code = this.getCode(n);
    //   this.login(code);
    // }
    // const url = `https://slack.com/oauth/authorize?scope=${scope}&client_id=247985127878.297865106401`;
    return (
      <div className="login-page">
        <div className="login-container">
          <p
            onClick={() => {
              console.log(this.props);
            }}
            className="login-header"
          >
            Sign into ApproveMe
          </p>
          <p className="sub-header">
            Login with your Slack account to view and manage your teams
            requests.
          </p>
          <a href="https://google.com">
            <img
              alt="Sign in with Slack"
              height="40"
              width="172"
              src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
            />
          </a>
        </div>
      </div>
    );
    // return <div>LOGIN PAGE</div>;
  }
}

export default LoginPage;
