import React, { Component } from "react";
import { compose, withProps } from "recompose"
import './App.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
require('dotenv').config({path: __dirname + "../server/config/.env"});
let gmap_url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLEMAPS_API;
if(!process.env.REACT_APP_MAP_KEY){
  gmap_url = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places";
}

const MyMapComponent = compose(
  withProps({
    googleMapURL: gmap_url,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={10}
    center={{lat:props.center.lat,lng:props.center.lng}}
  >
    {props.venues.map((venue, index) => {
      return (
        <Marker 
          key={venue.id} 
          position={{lat: venue.location.lat, lng: venue.location.lng}}
          onMouseOver={() => props.handleToggleMouse(venue.id)}
          onMouseOut={() => props.handleToggleMouse("")}
          onClick={() => {
            props.handleOpen(venue.id);
          }}
        >
          {props.openHoverInfoWindow === venue.id && 
          <InfoWindow options={{maxWidth: "200", disableAutoPan: true}}>
            <div>
              <h6>{venue.name}</h6>
              <p style={{marginBottom: "2px"}}>{venue.location.formattedAddress.toString()}</p>
              <div>
                <img alt="" style={{verticalAlign: "middle"}} src={venue.categories["0"].icon.prefix + "bg_32" + venue.categories["0"].icon.suffix}></img>
                <span style={{verticalAlign: "middle", paddingLeft: "8px"}}>{venue.categories["0"].name}</span>
              </div>
            </div>
          </InfoWindow>
          }
          {props.openInfoWindow === venue.id && 
          <InfoWindow options={{maxWidth: "320", maxHeight: "500"}} onCloseClick={() => props.handleClose()}>
            <div>
              <div>
                <img alt="" style={{float: "left", paddingRight: "8px"}} src={venue.details.venue.bestPhoto.prefix + "100x100" + venue.details.venue.bestPhoto.suffix}></img>
                <div>
                  <h6 style={{paddingLeft: "8px"}}>{venue.details.venue.name}</h6>
                  <i style={{float: "left", paddingRight:"5px"}} className="far fa-clock"></i>
                  <p style={{marginBottom: "2px"}}>{venue.details.venue.hours.status || "Check website"}</p>
                  <i style={{float: "left", paddingRight:"5px"}} class="fas fa-phone"></i>
                  <p style={{marginBottom: "2px"}}>{venue.details.venue.contact.phone || "Check website"}</p>
                  <i style={{paddingRight: "5px"}}className="fas fa-globe"></i>
                  <a href={venue.details.venue.url} target="_blank" rel="noopener noreferrer">{venue.details.venue.url}</a>
                </div>
              </div>
              <div style={{paddingTop: "10px"}}>
                <i style={{float: "left", paddingRight:"5px"}} className="fas fa-map-marker"></i>
                <p style={{marginBottom: "2px"}}>{venue.details.venue.location.formattedAddress.toString()}</p>
              </div>
              <i style={{float: "left", paddingRight:"5px"}} class="fas fa-dollar-sign"></i>
              <p defaultValue="Moderate" style={{marginBottom: "2px"}}>{venue.details.venue.price.message || "Moderate"}</p>
            </div>
          </InfoWindow>
          }
        
        </Marker>
      )
      })}
  </GoogleMap>
)

class Map extends React.PureComponent {
  state = {
    venues: [],
    openInfoWindowMarkerID: "",
    openHoverInfoWindow: "",
    center: {
      lat: 40.7,
      lng: -74
    },
  }

  handleToggleMouse = (venueID) => {
    if(this.state.openInfoWindowMarkerID === ""){  // If not clicked, open hover window
      this.setState({
        openHoverInfoWindow: venueID
      });
    }
  }

  handleOpen = (venueID) => {
    if(this.state.openHoverInfoWindow){ // If hover is open, close it
      this.setState({
        openHoverInfoWindow: ""
      })
    }
    // get venue with id to check for details 
    let result = this.state.venues.filter(venue => {
      return venue.id === venueID
    });

    // check for details to prevent unnecessary refetching
    if(!result[0].details){ // no venue details
      this.getVenueDetails(venueID)
      .then((x) => {
        this.setState({
          openInfoWindowMarkerID: venueID
        });
      });
    }else{ // venue details already there
      this.setState({
        openInfoWindowMarkerID: venueID
      });
    }

  }

  handleClose = () => {
    this.setState({
      openInfoWindowMarkerID: ""
    });
  }

  async getVenueDetails(venueID) {
    const response = await fetch("/venuedetails/" + venueID,{
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((rawres) => {
      return rawres.json();
    }).then((myJson) => {

      //Adds details object to venue
      for(let x of this.state.venues){
        console.log(this.state.venues);
        if(x.id === venueID){
          x['details'] = myJson.response;
          //dirty validation. do on server side
          if(!myJson.response.venue.price){
            x['price'] = {message: "Moderate"};
          }
          if(!myJson.response.venue.hours){
            x['hours'] = {status: "Check Website"};
          }
          if(!myJson.response.venue.contact.phone){
            x['contact'] = {phone: "Check Website"};
          }
          return;
        }
      }
    })
    return response;
  }

  handleFormData = (formState) => {
    this.setState({
      venues: formState,
      center: {
        lat: formState[0].location.lat,
        lng: formState[0].location.lng
      }
    });
  }

  render() {
    const mapstyle = {
      height: "100vh",
      width: "100vw",
      padding: "4vh",
      paddingTop: "9vh",
      position: "relative"
    };

    return (
    <div>
      <div>
        <Search handleData={this.handleFormData} loadSavedVenues={this.loadSavedVenues}></Search>
      </div>
      <div class="map" style={mapstyle}>
        <MyMapComponent
          center={this.state.center}
          openInfoWindow={this.state.openInfoWindowMarkerID}
          openHoverInfoWindow={this.state.openHoverInfoWindow}
          venues={this.state.venues}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          handleToggleMouse={this.handleToggleMouse}
        />
      </div>
    </div>
    )
  }
}

class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      query: "",
      location: "New York, NY"
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    let url = new URL("/searchvenues");
    let params = {query:this.state.query, near:this.state.location}
    url.search = new URLSearchParams(params).toString();

    fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((rawres) => {
      return rawres.json();
    }).then((venues) => {
      //let venues = myJson.response.groups[0].items;
      this.props.handleData(venues);
    });
    e.preventDefault();
  }

  render() {
    const formstyle = {
      paddingLeft: "4vh",
      paddingTop: "2vh",
      position: "relative",
      borderColor: "#000000"
    };
    const inputstyle = {
      float: "left",
      display: "flex",
      flexDirection: "row",
      flex: "1",
      position: "relative",
      width: "50%",
      whiteSpace: "nowrap",
      color: "#000000",
      fontWeight: "500",
      borderColor: "#000000"
    };
    const textstyle = {
      color: "#000000",
      borderColor: "#000000",
      borderWidth: "1px",
      textAlign: "center",
      zIndex: "1",
      outline: "none"
    };
    const buttonstyle = {
      color: "#000000",
      borderColor: "#000000",
      borderWidth: "1px",
      textAlign: "center",
      zIndex: "1",
      outline: "none"
    };

    return (
      <div class="input" style={formstyle}>
        <div class="searchdiv">
          <form style={inputstyle} onSubmit={this.handleSubmit}>
            <span style={inputstyle} className="fa-border">Venue Locator</span>
            <button style={buttonstyle} className="fas fa-search fa-border" disabled></button>
            <input type="text" style={textstyle} name="query" onChange={this.handleChange} placeholder="Search"></input>
            <button style={buttonstyle} className="fas fa-map-marker-alt fa-border" disabled></button>
            <input style={textstyle} type="text" name="location" onChange={this.handleChange} placeholder="New York, NY"></input>
            <button style={buttonstyle} type="submit"><i className="fas fa-arrow-right"></i></button>
          </form>
        </div>
      </div>
    );
  }

}

export default Map;