import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from '../styles/WarningModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class WarningModal extends Component {

  state = {
    open: false,
    message: "Proposta enviada com sucesso!"
  }

  componentDidMount(){
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.props.handleWarningModal();
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >  
          <DialogTitle id="alert-dialog-title">
            <FontAwesomeIcon icon={faTimesCircle} className={styles.closeIcon} size="4x" color="#c90a0a" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText className={styles.contentText}>
              Você deve escolher um local dentro do polo de atuação.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              ENTENDI
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

}

export default WarningModal;