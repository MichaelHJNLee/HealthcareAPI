import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.getDoctors = this.getDoctors.bind(this);
    this.getAppointments = this.getAppointments.bind(this);
  }

  getDoctors() {
    axios.get('/doctors')
      .then((response) => {
        this.setState({
          data: response.data
        })
      })
  }

  getAppointments(doctor) {
    axios.get(`/appointments/${doctor}/05-09-2018`)
      .then((response) => {
        this.setState({
          data: response.data
        })
      })
  }

  render() {
    return (
      <div>
        <div>{JSON.stringify(this.state.data)}</div>
        <button onClick={this.getDoctors}>Test Get All Doctors</button>
        <button onClick={() => {this.getAppointments(1)}}>Test Get All Appointments for Julius Hibbert</button>
        <button onClick={() => {this.getAppointments(2)}}>Test Get All Appointments for Algernop Krieger</button>
      </div>
    )
  }
}

export default App;