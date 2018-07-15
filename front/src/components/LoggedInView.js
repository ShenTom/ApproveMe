import React, { Component } from 'react'
import SideBar from './sideBar/SideBar';
import Main from './main/Main';
import './LoggedInView.css'
import {connect} from 'react-redux';
import {fetchAllData, fetchAllDataError, fetchAllDataSuccess} from '../actions/LoggedInView';
import {url} from "../api/api"
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      main_view: "DASHBOARD"
    }
    this.update_main_view = this.update_main_view.bind(this)
    this.getChannels = this.getChannels.bind(this)
    this.getPrivateChannels = this.getPrivateChannels.bind(this)
    this.getRequests = this.getRequests.bind(this)
  }

  update_main_view(new_view, id){
    this.setState({
      main_view: new_view,
      channel_id: id,
      loadedData: false
    });
  }

  async getChannels(){
    const url = "https://slack.com/api/channels.list?token=" + this.props.location.state.token;
    const res = await fetch(url);
    const resJson = await res.json();
    if(resJson.ok){
      return resJson.channels
    }
    return []
  }

  async getPrivateChannels(){
    const url = "https://slack.com/api/groups.list?token=" + this.props.location.state.token;
    const res = await fetch(url);
    const resJson = await res.json();
    if(resJson.ok){
      return resJson.groups
    }
    return []
  }

  async getRequests(){
    const res = await fetch(url+"/requests/users/"+this.props.location.state.user_id, {
                        method: 'GET',
                        headers: {
                          'Content-type': 'application/json',
                          'access-key': 'cactes2018'
                        }
                      })
    const resJson = await res.json();
    return resJson
  }

  async componentDidMount(){
    if(this.props.location.state){
      if(!this.state.loadedData){
        let data = {}
        this.props.fetchAllData();
        const channels = await this.getChannels();
        data["channels"] = channels;
        const groups = await this.getPrivateChannels();
        data["groups"] = groups
        const requests = await this.getRequests();
        data["requests"] = requests.requested.concat(requests.tagged)
        data["requested"] = requests.requested
        data["tagged"] = requests.tagged;
        data["user_id"] = this.props.location.state.user_id
        this.props.fetchAllDataSuccess(data);
        this.setState({
          loadedData: true
        })
      }
    } else {
      this.props.history.push({
        pathname: '/login'
      });
    }


  }

  render() {
    return (
      <div className="container">
        <SideBar updateView={this.update_main_view} channels={this.props.loadedData.channels} view={this.state.main_view} groups={this.props.loadedData.groups}/>
        <Main updateView={this.update_main_view} view={this.state.main_view} channel_id={this.state.channel_id}/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllData: () => dispatch(fetchAllData()),
    fetchAllDataSuccess: (data) => dispatch(fetchAllDataSuccess(data)),
    fetchAllDataError: () => dispatch(fetchAllDataError()),
  };
}

function mapStateToProps(state) {
  return {
    loadedData: state.data,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
