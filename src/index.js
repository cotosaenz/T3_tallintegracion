import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { io } from "socket.io-client";
import './index.css';
import {Point, Point2, Plane} from './react-leaflet-icon.js';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
const socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl/", {
  path: '/flights'
});

export default class App extends Component {
  chatContainer = React.createRef();
  state = {
    userName: '',
    isLoggedIn: false,
    messages: [],
    flights: [],
    positions: [],
    planes: [],
    p2: [],
    fp: {}
  }

  onButtonClicked = (value) => {
    var d = new Date();
    var c = d.toString();
    socket.emit("CHAT", {name:this.state.userName, date:c, message:value});
    document.getElementById('message').value = '';
  }
  
  buttonUsernameClicked = (value) => {
    this.setState({ isLoggedIn: true, userName: value });
  }

  componentDidMount() {
    socket.on("connect", () => {
      console.log(socket.connected);
    });

    socket.emit("FLIGHTS");
    socket.on("FLIGHTS", (data) => {
      console.log(data);
      this.setState((state) =>
        ({flights: data})
      );
      var positions = [];
      var fp = {};
      var planes = [];
      var c = 0;
      data.map( flight => {
        positions.push(flight.origin);
        fp[flight.code] = c;
        planes.push(c);
        c += 1;
        return 1;
        }
        )
      this.setState(
        {
          positions
        }
      );
      this.setState(
        {
          fp
        }
      );
      this.setState(
        {
          planes
        }
      );
    });

    socket.on("POSITION", (data) => {
      var positions = [];
      this.state.positions.map( p =>
        positions.push(p)
        )
      positions[this.state.fp[data.code]] = data.position;
      let p2 = [...this.state.p2, data.position];
      this.setState(
        {
          positions
        }
      );
      this.setState(
        {
          p2
        }
      );
    });

    socket.on("CHAT", (data) => {
      var f = new Date(data.date);
      var c = f.toLocaleString();
      var hour = (parseInt(c.slice(11,13))).toString()
      var final = c.slice(0,10).replace(/-/g,"/") + ' '+ hour+c.slice(13,16);
      let messages = [...this.state.messages, {
        name: data.name,
        date: final,
        message: data.message
      }];
      if(this.state.isLoggedIn) {
        this.setState(
          {
            messages
          },
          () => this.scrollToMyRef()
        );
      }
      else {
        this.setState(
          {
            messages
          }
        );
      }
      // el html y css del chat me base de aca: https://www.bootdey.com/snippets/view/animated-chat-window#html
    });
  }

  scrollToMyRef = () => {
    const scroll = this.chatContainer.current.scrollHeight - this.chatContainer.current.clientHeight; 
    this.chatContainer.current.scrollTo(0, scroll);
  };
  // esta funcion la obtuve de aca: https://codesandbox.io/s/8l2y0o24x9?file=/src/index.js:555-643

  render() {
    return (
      <React.Fragment>
        <div className='fluid-container'>
          <div className='row'>
            <div className='col-8'>
              <h1>Mapa en vivo:</h1>
              <div className="map_box">
                <MapContainer center={[0, 0]} zoom={1.4} scrollWheelZoom={true}>
                  <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  {this.state.flights.map( flight =>
                    <Marker position={flight.origin} icon={Point}>
                      <Polyline smoothFactor={1} positions={[flight.origin, flight.destination]}></Polyline>
                    </Marker>
                  )}
                  {this.state.flights.map( flight =>
                    <Marker position={flight.destination} icon={Point}></Marker>
                  )}
                  {this.state.p2.map( p =>
                    <Marker position={p} icon={Point2}></Marker>
                  )}
                  {this.state.planes.map( plane =>
                    <Marker position={this.state.positions[plane]} icon={Plane}>
                      <Popup>
                        Code: {this.state.flights[plane].code} <br />
                      </Popup>
                    </Marker>
                  )};
                </MapContainer>
              </div>
              <div className="space"></div>
              <div className="flights_box">
                <h4>Vuelos:</h4>
                {this.state.flights.map( flight => 
                  <li key={flight.code}>Code: {flight.code},  Airline: {flight.airline},  Origen: ({flight.origin[0]}, {flight.origin[1]}),  Destino: ({flight.destination[0]}, {flight.destination[1]}),  Plane: {flight.plane}, Passangers: {flight.passengers[0].name}...</li>
                )}
              </div>
            </div>
            <div className='col-4'>
              <div>
              {this.state.isLoggedIn ? 
              <div>
                <div className='chat_window'>
                  <div className='top_menu'>
                    <div className='title'>Centro de Control</div>
                  </div>
                  <ul>
                    <div ref={this.chatContainer} className='Chat'>
                      {this.state.messages.map( msg => 
                        <li  key={msg.message+msg.date+msg.name}>
                          <div>
                            ({msg.date})     {msg.name}: {msg.message}
                          </div>
                        </li>
                        )}
                    </div>  
                  </ul>
                  <div className="bottom_wrapper clearfix">
                    <div className="message_input_wrapper">
                      <input id='message' className="message_input" placeholder="Escribe algo aquí..."/>
                    </div>
                    <div className="send_message">
                      <button type="button" className="btn btn-outline-primary" onClick={() => this.onButtonClicked(document.getElementById('message').value)}>Send</button>
                    </div>
                  </div>
                </div>
              </div>  
              :
              <div>
                <h3>Regístrate para poder chatear!</h3>
                <div className="input-group">
                  <input type="search" id='nickname' className="form-control rounded" placeholder="Nickname" aria-label="Search"
                    aria-describedby="search-addon" />
                  <button type="button" className="btn btn-outline-primary" onClick={() => this.buttonUsernameClicked(document.getElementById('nickname').value)}>Ingresar</button>
                </div>
              </div>  
              }
              </div>
          </div>
        </div>
        </div>
     </React.Fragment> 
    );
  }
}    

ReactDOM.render(<App />, document.getElementById('root'));