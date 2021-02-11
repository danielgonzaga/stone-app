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
import { faStore, 
         faCompass,
         faBuilding,
         faSearchDollar,
         faTrash 
       } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/Modal.module.css';
import Link from 'next/link';

class Modal extends Component {

  state = {
    open: false,
    showFastMessage: false,
    message: ""
  }

  componentDidMount(){
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.props.handlePinModal();
    this.setState({
      open: false
    });
  };

  async handleTransform(infos) {
    const data = {
      name: infos.name,
      address: infos.address,
      segment: infos.segment,
      potential_tpv: infos.potential_tpv,
      latitude: infos.position.lat,
      longitude: infos.position.lng,
      satisfaction: 100,
      migration: 0,
      last_visit: "-",
      visit_today: false
    };

    let firebase = await firebaseDB();
    await firebase.firestore()
                  .collection("clients")
                  .doc(infos.id)
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
                      longitude: 0
                    })
                  })
                  .catch((e) => {
                    alert("Error: ", e);
                  });
  
    this.handleDelete(infos);
  };

  async handleDelete(infos) {
    let firebase = await firebaseDB();
    await firebase.firestore()
                  .collection(infos.type)
                  .doc(infos.id)
                  .delete()
                  .then(() => {
                    this.props.loadPins();
                    this.setState({
                      open: false,
                      showFastMessage: true
                    });                    
                  })
                  .catch((e) => {
                    alert("Error: ", e);
                  });

    setTimeout(() => {
      this.setState({showFastMessage: false});
      window.location.reload();
      //this.props.handleShowMarker();
    }, 2000)

  };

  deletePin = () => {
    this.setState({
      message: "Pin deletado com sucesso!"
    })
    this.handleDelete(this.props.infos);
  }

  transformPin = () => {
    this.setState({
      message: "Pin transformado com sucesso!"
    })
    this.handleTransform(this.props.infos);
  }

  render() {
    let transformButton;
    let seeMore;
    let pinType = this.props.infos.type;
    if (pinType == "leads") {
      transformButton = <Button onClick={this.transformPin} color="primary">
                          CONVERTER
                        </Button>
      seeMore = <Button color="primary">
                  <Link   className={styles.link}
                          href={{
                          pathname: "/lead",
                          query: { id: this.props.infos.id }
                        }}>
                    <div className={styles.buttonContent}>
                      VER MAIS
                    </div>
                  </Link>
                </Button>
    } else {
      transformButton = <></>
      seeMore = <Button color="primary">
                  <Link className={styles.link}
                        href={{
                        pathname: "/client",
                        query: { id: this.props.infos.id }
                        }}>
                    <div className={styles.buttonContent}>
                      VER MAIS
                    </div>
                  </Link>
                </Button>
    }

    return (
      <div>
        {this.state.showFastMessage && <FastMessage textContent={this.state.message} show={this.state.showFastMessage}/>}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >  
          <DialogTitle id="alert-dialog-title">
            <FontAwesomeIcon icon={faStore} size="1x" color="gray"/>&nbsp;&nbsp;{this.props.infos.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FontAwesomeIcon icon={faCompass} size="1x" color="gray"/>&nbsp;&nbsp;
              <b>Endereço:</b> {this.props.infos.address}
              <br/>
              <FontAwesomeIcon icon={faBuilding} size="1x" color="gray"/>&nbsp;&nbsp;
              <b>Segmento:</b> {this.props.infos.segment}
              <br/>
              <FontAwesomeIcon icon={faSearchDollar} size="1x" color="gray"/>&nbsp;&nbsp;
              <b>TPV potencial:</b> R${this.props.infos.potential_tpv}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deletePin} color="secondary">
              DELETAR
            </Button>
            {transformButton}
            {seeMore}
          </DialogActions>
        </Dialog>
      </div>
    );
  }

}

export default Modal;