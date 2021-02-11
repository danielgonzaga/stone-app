import React, { Component } from 'react';
import { firebaseDB } from '../lib/firebase';
import FastMessage from './FastMessage';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from '../styles/Lead.module.css';

class ProposalModal extends Component {

  state = {
    open: false,
    message: "Proposta enviada com sucesso!"
  }

  showFastMessage = false;

  componentDidMount(){
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.props.handleProposalModal();
    this.setState({
      open: false
    });
  };

  handleProposal = () => {
    this.sendProposal();
  };

  async sendProposal(){
    let firebase = await firebaseDB();
    await firebase.firestore()
                  .collection("leads")
                  .doc(this.props.leadId)
                  .set({commercial_proposal: true},
                       { merge: true })
                  .then(() => {
                    this.showFastMessage = true;
                    this.setState({open: false});
                    
                    setTimeout(() => {
                      this.showFastMessage = false;
                      this.handleClose();
                    }, 2000)
                  })
                  .catch((e) => {
                    alert("Error: ", e);
                  });
    //this.handleClose();
  }

  render() {
    return (
      <div>
        {this.showFastMessage && <FastMessage textContent={this.state.message} show={this.showFastMessage}/>}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >  
          <DialogTitle className={styles.proposalTitle} id="alert-dialog-title">
            Proposta comercial
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <textarea className={styles.proposalInput} type="text"></textarea>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              VOLTAR
            </Button>
            <Button color="primary" onClick={this.handleProposal}>
              ENVIAR
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

}

export default ProposalModal;