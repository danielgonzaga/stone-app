import { Map, Marker, GoogleApiWrapper, Polygon } from 'google-maps-react';
import React, { Component } from 'react';
import { firebaseDB } from '../lib/firebase';
import Modal from './Modal';
import WarningModal from './WarningModal';
import FilterModal from './FilterModal';
import AddPinModal from './AddPinModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, 
         faMoon, 
         faSun, 
         faFilter
       } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Map.module.css';
import pinClients from '../assets/pinClients.png';
import pinLeads from '../assets/pinLeads.png';


export class StoneMap extends Component {
  // VARIABLES
  pinClicked = [];

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    mapCenter: {
      lat: -22.915776135006166,
      lng: -43.24887050264740
    },
    clientsPins: [],
    leadsPins: [],
    showPinModal: false,
    showAddModal: false,
    showFilterModal: false,
    showWarningModal: false,
    pickingPosition: false,
    newPinLatitude: "",
    newPinLongitude: "",
    poleCoords: [],
    mapStyle: this.props.lightMapStyle,
    mapStyleIcon: <FontAwesomeIcon icon={faMoon} className={styles.moonSunIcon} size="1x" color="white" onClick={this.handleMapStyle} />,
    renderMap: 0,
    segments: [],
    showMarkerNoVisitToday: true,
    showMarkerVisitToday: true,
    showMarkerNoProposal: true,
    showMarkerWithProposal: true,
    showMarkerTpv10: true,
    showMarkerTpv1020: true,
    showMarkerTpv20: true,
    filteredSegments: []
  };
  
  // SERVICES
  async getClients() {
    let data = [];
    let firebase = await firebaseDB();
    let snapshot = await firebase
                          .firestore()
                          .collection('clients')
                          .get();
    snapshot.forEach((doc) => {
      data.push(
        Object.assign({
          id: doc.id
        }, doc.data())
      );
    })
    return data;
  }

  async getLeads() {
    let data = [];
    let firebase = await firebaseDB();
    let snapshot = await firebase
                          .firestore()
                          .collection('leads')
                          .get();
    snapshot.forEach((doc) => {
      data.push(
        Object.assign({
          id: doc.id
        }, doc.data())
      );
    })
    return data;
  }

  async getPole() {
    let pole = [];
    let lat;
    let lng;
    
    let firebase = await firebaseDB();
    let snapshot = await firebase
    .firestore()
    .collection('user')
    .get('pole');
    
    snapshot.forEach((doc) => {
      let docContent = doc.data();
      
      Object.keys(docContent.coords).map(key => {
        lat = docContent.coords[key].x_;
        lng = docContent.coords[key].N_;
        pole.push({lat, lng});
      });
      
    })
    
    return pole;
  }

  // END OF SERVICES

  componentDidMount(){
    this.loadPins();
    this.handleGetPole();
  }

  handlePinModal = () => {
    this.setState({
      showPinModal: !this.state.showPinModal
    });
  }

  handleAddModal = () => {
    this.setState({
      showAddModal: !this.state.showAddModal
    });
  }

  handleFilterModal = () => {
    this.setState({
      showFilterModal: !this.state.showFilterModal
    });
  }

  handleWarningModal = () => {
    this.setState({
      showWarningModal: !this.state.showWarningModal
    });
  }

  handleGetPole = () => {
    this.getPole().then((data) => {
      this.setState({
        poleCoords: data
      })
    });
  }

  onClientClick = (props, marker, e) => {
    this.pinClicked = props;
    this.handlePinModal();
  }

  onLeadClick = (props, marker, e) => {
    this.pinClicked = props;
    this.handlePinModal();
  }

  isPickingPosition = () => {
    this.setState({
      pickingPosition: true
    })
  }

  loadPins = () => {
    this.getClients().then((data) => {

      let clientsCoords = [];
      let segments = [];

      data.forEach((client) => {
        let newClient = { id: client.id, 
                          name: client.name,
                          address: client.address,
                          potential_tpv: client.potential_tpv,
                          segment: client.segment,
                          lat: client.latitude, 
                          lng: client.longitude,
                          type: "clients",
                          visit_today: client.visit_today,
                          last_visit: client.last_visit,
                          icon: {url: pinClients, scaledSize: new google.maps.Size(20,35)} 
                        };
        clientsCoords.push(newClient);
        segments.push({ value: client.segment, label: client.segment });
      })

      let joined = this.state.clientsPins.concat(clientsCoords);
      this.setState({ clientsPins: joined, segments: segments })
    });

    this.getLeads().then((data) => {

      let leadsCoords = [];

      data.forEach((lead) => {
        let newLead = { id: lead.id,
                        name: lead.name,
                        address: lead.address,
                        potential_tpv: lead.potential_tpv,
                        segment: lead.segment,
                        lat: lead.latitude, 
                        lng: lead.longitude, 
                        type: "leads",
                        visit_today: lead.visit_today,
                        last_visit: lead.last_visit,
                        commercial_proposal: lead.commercial_proposal,
                        negotiation_status: lead.negotiation_status,
                        icon: {url: pinLeads, scaledSize: new google.maps.Size(20,35)}
                      };
        leadsCoords.push(newLead);
      })

      let joined = this.state.leadsPins.concat(leadsCoords);
      this.setState({ leadsPins: joined })
    });
  }
  
  onMapClicked = (props, marker, e) => {
    if(this.state.pickingPosition == true) {
      this.handleWarningModal();
    }
  };

  onPoleClicked = (props, marker, e) => {
    if(this.state.pickingPosition == true) {
      this.setState({
        newPinLongitude: e.latLng.lng(),
        newPinLatitude: e.latLng.lat(),
        pickingPosition: false
      })
    }
  }

  handleMapStyle = () => {
    this.renderMapIncrement();

    if(this.state.mapStyle == this.props.lightMapStyle) {
      this.setState({
        mapStyle: this.props.darkMapStyle,
        mapStyleIcon: <FontAwesomeIcon icon={faSun} className={styles.moonSunIcon} size="1x" color="white" onClick={this.handleMapStyle} />
      });
    } else if (this.state.mapStyle == this.props.darkMapStyle) {
      this.setState({
        mapStyle: this.props.lightMapStyle,
        mapStyleIcon: <FontAwesomeIcon icon={faMoon} className={styles.moonSunIcon} size="1x" color="white" onClick={this.handleMapStyle} />
      });
    }
  }

  renderMapIncrement = () => {
    let count = this.state.renderMap;
    count += 1;
    this.setState({
      renderMap: count
    });
  }

  handleShowMarker = () => {
    this.setState({
      showMarker: !this.state.showMarker
    })
  }

  handleFilterCondition = (noProposalShow,
                           withProposalShow,
                           withVisitShow,
                           noVisitShow,
                           tpv10Show,
                           tpv1020Show,
                           tpv20Show,
                           filteredSegments) => {
    this.setState({
      showMarkerNoProposal: noProposalShow,
      showMarkerWithProposal: withProposalShow,
      showMarkerVisitToday: withVisitShow,
      showMarkerNoVisitToday: noVisitShow,
      showMarkerTpv10: tpv10Show,
      showMarkerTpv1020: tpv1020Show,
      showMarkerTpv20: tpv20Show,
      filteredSegments: filteredSegments
    })
  }

  render() {
    
    return (
      <div>
        <div className={styles.plusIconBackground}></div>
        <FontAwesomeIcon icon={faPlusCircle} className={styles.plusIcon} size="3x" color="#22b24c" onClick={this.handleAddModal}/>
        <div className={styles.filterIconBackground} onClick={this.handleFilterModal} ></div>
        <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} size="1x" color="white" onClick={this.handleFilterModal} />
        <div className={styles.mapStyleBackground} onClick={this.handleMapStyle} ></div>
        {this.state.mapStyleIcon}
        {this.state.showWarningModal &&  <WarningModal handleWarningModal={this.handleWarningModal}/>}
        {this.state.showAddModal &&  <AddPinModal handleAddModal={this.handleAddModal} 
                                                  isPickingPosition={this.isPickingPosition}
                                                  hideModal={this.state.pickingPosition} 
                                                  latitude={this.state.newPinLatitude} 
                                                  longitude={this.state.newPinLongitude}
                                                  loadPins={this.loadPins} />}
        {this.state.showFilterModal &&  <FilterModal handleFilterModal={this.handleFilterModal} 
                                                     loadPins={this.loadPins}
                                                     segments={this.state.segments}
                                                     handleFilterCondition={this.handleFilterCondition}/>}
        <Map 
          fullscreenControl={false}
          streetViewControl={false}
          mapTypeControl={false}
          zoomControlOptions={{position: google.maps.ControlPosition.TOP_RIGHT}}
          styles={this.state.mapStyle}
          key={this.state.renderMap}
          google={this.props.google}
          initialCenter={this.state.mapCenter}
          zoom={14}
          onClick={this.onMapClicked}
          options={{ styles: [] }}
          >
            <Polygon
              paths={this.state.poleCoords}
              strokeColor="gray"
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor="#fff9bf"
              fillOpacity={0.25} 
              onClick={this.onPoleClicked}/>
          
          {this.state.showPinModal &&  <Modal infos={this.pinClicked} 
                                              handlePinModal={this.handlePinModal} 
                                              loadPins={this.loadPins}
                                              handleShowMarker={this.handleShowMarker}/>}
          {this.state.clientsPins.filter(x => x.visit_today == true).map(place => {
            return this.state.showMarkerVisitToday && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onClientClick}
              />
            );
          })}

          {this.state.clientsPins.filter(x => x.visit_today == false).map(place => {
            return this.state.showMarkerNoVisitToday && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onClientClick}
              />
            );
          })}

          {this.state.clientsPins.filter(x => x.potential_tpv < 10000).map(place => {
            return this.state.showMarkerTpv10 && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onClientClick}
              />
            );
          })}

          {this.state.clientsPins.filter(x => x.potential_tpv >= 10000 && x.potential_tpv < 20000).map(place => {
            return this.state.showMarkerTpv1020 && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onClientClick}
              />
            );
          })}

          {this.state.clientsPins.filter(x => x.potential_tpv >= 20000).map(place => {
            return this.state.showMarkerTpv20 && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onClientClick}
              />
            );
          })}

          {this.state.clientsPins.filter(x => this.state.filteredSegments.includes(x.segment)).map(place => {
            return (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onClientClick}
              />
            );
          })}

          {this.state.leadsPins.filter(x => x.visit_today == true).map(place => {
            return this.state.showMarkerVisitToday && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}

          {this.state.leadsPins.filter(x => x.visit_today == false).map(place => {
            return this.state.showMarkerNoVisitToday && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}
          
          {this.state.leadsPins.filter(x => x.commercial_proposal == false).map(place => {
            return this.state.showMarkerNoProposal && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}

          {this.state.leadsPins.filter(x => x.commercial_proposal == true).map(place => {
            return this.state.showMarkerWithProposal && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}

          {this.state.leadsPins.filter(x => x.potential_tpv < 10000).map(place => {
            return this.state.showMarkerTpv10 && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}

          {this.state.leadsPins.filter(x => x.potential_tpv >= 10000 && x.potential_tpv < 20000).map(place => {
            return this.state.showMarkerTpv1020 && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}

          {this.state.leadsPins.filter(x => x.potential_tpv >= 20000).map(place => {
            return this.state.showMarkerTpv20 && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}

          {this.state.leadsPins.filter(x => this.state.filteredSegments.includes(x.segment)).map(place => {
            return this.state.showMarkerTpv20 && (
              <Marker
                id={place.id}
                icon={place.icon}
                key={place.id}
                name={place.name}
                address={place.address}
                potential_tpv={place.potential_tpv}
                segment={place.segment}
                position={{ lat: place.lat, lng: place.lng }}
                type={place.type}
                onClick={this.onLeadClick}
              />
            );
          })}

        </Map>
      </div>
    )
  }
}

StoneMap.defaultProps = {
  darkMapStyle: [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#202c3e"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            },
            {
                "weight": "1.39"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "0.96"
            },
            {
                "saturation": "9"
            },
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": "9"
            },
            {
                "color": "#29446b"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 10
            },
            {
                "saturation": -30
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#193a55"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            }
        ]
    }
  ],
  lightMapStyle: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]
};

export default GoogleApiWrapper({
  apiKey: ("AIzaSyADkgjkSauDFo7mmwUGVJBEputIZm9mdsU")
  //apiKey: (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
})(StoneMap)