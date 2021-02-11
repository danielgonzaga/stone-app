import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class FastMessage extends Component {
  render() {
      return (
        <div>
          <Dialog 
            PaperProps={{
              style: {
                backgroundColor: '#22b24c',
                borderRadius: 15
              },
            }}
            open={this.props.show}
            TransitionComponent={Transition}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
              <span style={{color: 'white'}}>{this.props.textContent}</span>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      );
  }
}

export default FastMessage;