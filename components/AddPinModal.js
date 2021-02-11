import React, { Component } from 'react';
import { firebaseDB } from '../lib/firebase';
import FastMessage from './FastMessage';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/AddPinModal.module.css'

class AddPinModal extends Component {

  state = {
    open: false,
    type: "clients",
    name: "",
    address: "",
    segment: "",
    potential_tpv: "",
    latitude: 0,
    longitude: 0,
    showFastMessage: false    
  }
  
  static getDerivedStateFromProps(props, state) {
    if(props.hideModal == false) {
      return {
        latitude: props.latitude,
        longitude: props.longitude
      }
    } else {
      return null
    }
  }

  componentDidMount(){
    this.setState({
      open: true
    });
  }

  async addNewPin(type) {
    let data;
    if(type == "clients") {
      data = {
        name: this.state.name,
        address: this.state.address,
        segment: this.state.segment,
        potential_tpv: this.state.potential_tpv,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        satisfaction: 100,
        migration: 0,
        last_visit: "-",
        visit_today: false
      };
    } else if(type == "leads") {
      data = {
        name: this.state.name,
        address: this.state.address,
        segment: this.state.segment,
        potential_tpv: this.state.potential_tpv,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        negotiation_status: "quente",
        qtd_visits: 0,
        last_visit: "-",
        visit_today: false,
        commercial_proposal: false
      }
    }

    let firebase = await firebaseDB();
    await firebase.firestore()
                  .collection(type)
                  .doc()
                  .set(data)
                  .then(() => {
                    this.props.loadPins();
                    this.setState({
                      open: false,
                      name: "",
                      address: "",
                      segment: "",
                      potential_tpv: "",
                      latitude: 0,
                      longitude: 0,
                      showFastMessage: true
                    })
                  })
                  .catch((e) => {
                    alert("Error: ", e);
                  });
    
    setTimeout(() => {
      this.setState({showFastMessage: false});
    }, 2000)
  }

  handleClose = () => {
    this.props.handleAddModal();
    this.setState({
      open: false
    });
  };

  handlePinType = (e) => {
    this.setState({
      type: e.target.value
    })
  }

  updateInput = (typed, whichInput) => {
    switch(whichInput) {
      case 0: this.setState({
                name: typed
              });
              break;

      case 1: this.setState({
                address: typed
              });
              break;

      case 2: this.setState({
                segment: typed
              });
              break;

      case 3: this.setState({
                potential_tpv: typed
              });
              break;
      
      case 4: this.setState({
                latitude: typed
              });
              break;
      case 5: this.setState({
                longitude: typed
              });
              break;
    }
  }

  pickPosition = () => {
    this.props.isPickingPosition();
  }

  createPin = () => {
    if(this.state.name != "" &&
       this.state.address != "" &&
       this.state.segment != "" &&
       this.state.potential_tpv != "" &&
       this.state.latitude != 0 &&
       this.state.longitude != 0) {
    
      this.addNewPin(this.state.type);
    } else {
      alert("Todos os campos devem ser preenchidos.");
    }
  }

  render() {
    return (
      <div>
        {this.state.showFastMessage && <FastMessage textContent={"Pin criado com sucesso!"} show={this.state.showFastMessage}/>}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen={false}
          hidden={this.props.hideModal}
        >  
          <DialogTitle className={styles.modal}>
            <p className={styles.title}>Criar novo pin</p>
          </DialogTitle>
          <DialogContent className={styles.modal}>
            <DialogContentText>
                <div className={styles.wrapper}>
                  <b>Cliente</b><b>Lead</b>
                  <br/>
                  <input type="radio"
                         name="clients"
                         value="clients"
                         onChange={this.handlePinType} 
                         checked={this.state.type == "clients"} >
                  </input>
                  <input type="radio" 
                         name="leads"
                         value="leads"
                         onChange={this.handlePinType}
                         checked={this.state.type == "leads"}>
                  </input>
                  
                </div>
                <br/>
                <b>Nome</b>
                <br/>
                <input className={styles.inputs} value={this.state.name} onChange={e => this.updateInput(e.target.value, 0)}/>
                <br/><br/>
                <b>Endereço</b>
                <br/>
                <input className={styles.inputs} value={this.state.address} onChange={e => this.updateInput(e.target.value, 1)}/>
                <br/><br/>
                <b>Segmento</b>
                <br/>
                <input className={styles.inputs} value={this.state.segment} onChange={e => this.updateInput(e.target.value, 2)}/>
                <br/><br/>
                <b>TPV Potencial</b>
                <br/>
                <input type="number" className={styles.inputs} value={this.state.potential_tpv} onChange={e => this.updateInput(e.target.value, 3)}/>
                <br/><br/>
                <div className={styles.wrapper}>
                  <b>Latitude</b><b>Longitude</b>
                  <br/>
                  <input type="number" className={styles.placesInput} value={this.state.latitude} onChange={e => this.updateInput(e.target.value, 4)}/>
                  <input type="number" className={styles.placesInput} value={this.state.longitude} onChange={e => this.updateInput(e.target.value, 5)}/>
                  <FontAwesomeIcon icon={faCrosshairs} size="2x" color="#22b24c" onClick={this.pickPosition}/>
                  {/*["lg","xs","sm","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]*/}
                </div>
              </DialogContentText>
          </DialogContent>
          <DialogActions className={styles.modal}>
            <Button onClick={this.handleClose} color="primary">
              VOLTAR
            </Button>
            <Button onClick={this.createPin} color="primary">
              CRIAR
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

}

export default AddPinModal;