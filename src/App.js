import React from 'react';
import sunset from './sunset.svg';
import cloud from './cloud.svg';
import sunny from './sunny.svg';
import snowflake from './snowflake.svg';
import rain from './rain.svg';
import './App.css';
import { Container, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';

/* Open Weather Map and Dark Sky keys. Put your keys here*/
const OWM_KEY = 'b5aa2cb48c912d58c17c0122cf3c3a06';
const DS_KEY = '26236e034de724b12c00ccdb54e68999';

/* The Form that takes the user's input and remembers things about the input, and its
weather data*/
class CityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      longitude: '',
      latitude: '',
      temp1: '',  // temp1 is the temperature reading from Open Weather Map
      condition1: '',
      details1: '',
      temp2: '',  // temp2 is the temperature reading from Dark Sky
      condition2: '',
      goodToLoad: false,  // Since Dark Sky needs a longitude/latitude to lookup weather,
      message: '',        // we need to ensure that we get the longitude/latitude from OWM first
      currentPic: sunset  // Changes the pictures based on the weather
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({city: event.target.value});
  }

  /* On submit, retrieve weather info about the requested city from Open Weather Map*/
  handleSubmit(event) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q='+this.state.city+'&appid='+OWM_KEY+'&units=metric')
    .then(res => res.json())
    .then(
      (result) => {
        if(!result.hasOwnProperty('coord')){  // Checking for valid input
          this.setState({
            message: 'City not found: '+this.state.city+'. Try typing "City, Country"'
          })
          return
        }
        this.setState({ // Update the state with weather info from Open Weather Map
          longitude: result['coord']['lon'],
          latitude: result['coord']['lat'],
          goodToLoad: true,
          temp1: result['main']['temp'],
          condition1: result['weather'][0]['main'],
          details1: result['weather'][0]['description'],
          message: 'Here is a look at the weather in '+this.state.city,
          temp2: 'Loading...',
          condition2: 'Loading...'
        })
      }
    )
    event.preventDefault();
  }

  /* This is when we check if we can grab weather info from Dark Sky*/
  componentDidUpdate(prevState){
    if(this.state.goodToLoad){
      fetch('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/'+DS_KEY+'/'+this.state.latitude+','+this.state.longitude+'?units=si&exclude=minutely,hourly,daily,alerts,flags')
      .then(res => res.json())
      .then(
        ( result ) => {
          switch(this.state.condition1) {  // Cases for setting the appropriate picture
            case 'Rain':
              this.setState({
                currentPic: rain
              })
              break;
            case 'Clear':
              this.setState({
                currentPic: sunny
              })
              break;
            case 'Clouds':
              this.setState({
                currentPic: cloud
              })
              break;
            case 'Snow':
              this.setState({
                currentPic: snowflake
              })
              break;
            default:
              
          }
          this.setState({  // Update the state with weather info from Dark Sky
            temp2: result['currently']['temperature'],
            condition2: result['currently']['summary'],
            goodToLoad: false
          });
        }
      )
    } 
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
      <img src= {this.state.currentPic} className="App-logo" alt="logo" />
        <br></br>
        <FormGroup>
          <Label>Enter a city name</Label>
          <Input type="text" value={this.state.city} onChange = {this.handleChange} placeholder='Ex: "Ottawa" or "London, Canada"' />
        </FormGroup>
        <p>{this.state.message}</p>
        <Container>
          <Row>
            <Col>
              <h2><a href='https://openweathermap.org/' target="_blank">Open Weather Map</a></h2>
              Temperature: {this.state.temp1}°C
              <br></br>Description: {this.state.condition1}
              <br></br>Details: {this.state.details1}
            </Col>
            <Col>
              <h2><a href='https://darksky.net' target="_blank">Dark Sky</a></h2>
              Temperature: {this.state.temp2}°C
              <br></br>Description: {this.state.condition2}
            </Col>
          </Row>
        </Container>       
      </Form>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CityForm  />
      </header>
      <div style={{fontSize:11}}>Icons made by <a href="https://www.flaticon.com/authors/smashicons" target="_blank">Smashicons</a> from <a href="https://www.flaticon.com/" 			   target="_blank">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC 3.0 BY</a></div>
    </div>
    
  );
}

export default App;
