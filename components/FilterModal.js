import React, { Component } from 'react';
import styles from '../styles/FilterModal.module.css'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingUsd, 
         faCommentSlash, 
         faCalendarCheck, 
         faCalendarTimes, 
         faCoins 
       } from '@fortawesome/free-solid-svg-icons'

class FilterModal extends Component {

  state = {
    open: false,
    showFastMessage: false,
    noProposalBox: styles.unselectedBigFilterBox,
    noProposalIcon: "#818181",
    noProposalShow: false,
    withProposalBox: styles.unselectedBigFilterBox,
    withProposalIcon: "#818181",
    withProposalShow: false,
    visitTodayBox: styles.unselectedBigFilterBox,
    withVisitIcon: "#818181",
    withVisitShow: false,
    noVisitTodayBox: styles.unselectedBigFilterBox,
    noVisitIcon: "#818181",
    noVisitShow: false,
    tpv10Box: styles.unselectedSmallFilterBox,
    tpv10Icon: "#818181;",
    tpv10Show: false,
    tpv1020Box: styles.unselectedSmallFilterBox,
    tpv1020Icon: "#818181",
    tpv1020Show: false,
    tpv20Box: styles.unselectedSmallFilterBox,
    tpv20Icon: "#818181;",
    tpv20Show: false,
    selectUnselectMessage: "Selecionar tudo",
    segmentSelectedOptions: []
  }

  componentDidMount(){
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.props.handleFilterModal();
    this.setState({
      open: false
    });
  };

  
  noProposalBoxClick = () => {
    if(this.state.noProposalBox == styles.selectedBigFilterBox) {
      this.setState({
        noProposalShow: false,
        noProposalBox: styles.unselectedBigFilterBox,
        noProposalIcon: "#818181"
      })
    } else if(this.state.noProposalBox == styles.unselectedBigFilterBox){
      this.setState({
        noProposalShow: true,
        noProposalBox: styles.selectedBigFilterBox,
        noProposalIcon: "white"
      })
    }
  }

  withProposalBoxClick = () => {
    if(this.state.withProposalBox == styles.selectedBigFilterBox) {
      this.setState({
        withProposalShow: false,
        withProposalBox: styles.unselectedBigFilterBox,
        withProposalIcon: "#818181"
      })
    } else if(this.state.withProposalBox == styles.unselectedBigFilterBox){
      this.setState({
        withProposalShow: true,
        withProposalBox: styles.selectedBigFilterBox,
        withProposalIcon: "white"
      })
    }
  }

  visitTodayBoxClick = () => {
    if(this.state.visitTodayBox == styles.selectedBigFilterBox) {
      this.setState({
        withVisitShow: false,
        visitTodayBox: styles.unselectedBigFilterBox,
        visitTodayIcon: "#818181"
      })
    } else if(this.state.visitTodayBox == styles.unselectedBigFilterBox){
      this.setState({
        withVisitShow: true,
        visitTodayBox: styles.selectedBigFilterBox,
        visitTodayIcon: "white"
      })
    }
  }

  noVisitTodayBoxClick = () => {
    if(this.state.noVisitTodayBox == styles.selectedBigFilterBox) {
      this.setState({
        noVisitShow: false,
        noVisitTodayBox: styles.unselectedBigFilterBox,
        noVisitTodayIcon: "#818181"
      })
    } else if(this.state.noVisitTodayBox == styles.unselectedBigFilterBox){
      this.setState({
        noVisitShow: true,
        noVisitTodayBox: styles.selectedBigFilterBox,
        noVisitTodayIcon: "white"
      })
    }
  }

  tpv10BoxClick = () => {
    if(this.state.tpv10Box == styles.selectedSmallFilterBox) {
      this.setState({
        tpv10Show: false,
        tpv10Box: styles.unselectedSmallFilterBox,
        tpv10Icon: "#818181"
      })
    } else if(this.state.tpv10Box == styles.unselectedSmallFilterBox){
      this.setState({
        tpv10Show: true,
        tpv10Box: styles.selectedSmallFilterBox,
        tpv10Icon: "white"
      })
    }
  }

  tpv1020BoxClick = () => {
    if(this.state.tpv1020Box == styles.selectedSmallFilterBox) {
      this.setState({
        tpv1020Show: false,
        tpv1020Box: styles.unselectedSmallFilterBox,
        tpv1020Icon: "#818181"
      })
    } else if(this.state.tpv1020Box == styles.unselectedSmallFilterBox){
      this.setState({
        tpv1020Show: true,
        tpv1020Box: styles.selectedSmallFilterBox,
        tpv1020Icon: "white"
      })
    }
  }

  tpv20BoxClick = () => {
    if(this.state.tpv20Box == styles.selectedSmallFilterBox) {
      this.setState({
        tpv20Show: false,
        tpv20Box: styles.unselectedSmallFilterBox,
        tpv20Icon: "#818181"
      })
    } else if(this.state.tpv20Box == styles.unselectedSmallFilterBox){
      this.setState({
        tpv20Show: true,
        tpv20Box: styles.selectedSmallFilterBox,
        tpv20Icon: "white"
      })
    }
  }

  selectAllBoxClick = () => {
    if(this.state.selectUnselectMessage == "Selecionar tudo") {
      this.setState({
        selectUnselectMessage: "Desselecionar tudo",
        noProposalShow: true,
        noProposalBox: styles.selectedBigFilterBox,
        noProposalIcon: "white",
        withProposalShow: true,
        withProposalBox: styles.selectedBigFilterBox,
        withProposalIcon: "white",
        withVisitShow: true,
        visitTodayBox: styles.selectedBigFilterBox,
        visitTodayIcon: "white",
        noVisitShow: true,
        noVisitTodayBox: styles.selectedBigFilterBox,
        noVisitTodayIcon: "white",
        tpv10Show: true,
        tpv10Box: styles.selectedSmallFilterBox,
        tpv10Icon: "white",
        tpv1020Show: true,
        tpv1020Box: styles.selectedSmallFilterBox,
        tpv1020Icon: "white",
        tpv20Show: true,
        tpv20Box: styles.selectedSmallFilterBox,
        tpv20Icon: "white"
      })
    } else if (this.state.selectUnselectMessage == "Desselecionar tudo") {
      this.setState({
        selectUnselectMessage: "Selecionar tudo",
        noProposalShow: false,
        noProposalBox: styles.unselectedBigFilterBox,
        noProposalIcon: "#818181",
        withProposalShow: false,
        withProposalBox: styles.unselectedBigFilterBox,
        withProposalIcon: "#818181",
        withVisitShow: false,
        visitTodayBox: styles.unselectedBigFilterBox,
        visitTodayIcon: "#818181",
        noVisitShow: false,
        noVisitTodayBox: styles.unselectedBigFilterBox,
        noVisitTodayIcon: "#818181",
        tpv10Show: false,
        tpv10Box: styles.unselectedSmallFilterBox,
        tpv10Icon: "#818181",
        tpv1020Show: false,
        tpv1020Box: styles.unselectedSmallFilterBox,
        tpv1020Icon: "#818181",
        tpv20Show: false,
        tpv20Box: styles.unselectedSmallFilterBox,
        tpv20Icon: "#818181"
      });
    }
  }

  handleSelectedOptions = (selectedOptions) => {
    this.setState({
      segmentSelectedOptions: selectedOptions
    })
  }

  handleFilter = () => {
    let filteredSegments = [];
    this.state.segmentSelectedOptions.forEach((item) =>{
      filteredSegments.push(item.value);
    })
    this.props.handleFilterCondition(this.state.noProposalShow, 
                                     this.state.withProposalShow, 
                                     this.state.withVisitShow, 
                                     this.state.noVisitShow, 
                                     this.state.tpv10Show, 
                                     this.state.tpv1020Show, 
                                     this.state.tpv20Show,
                                     filteredSegments);
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <div >
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen={true}          
          >
          <DialogTitle className={styles.modal}>
            <p className={styles.title}>Selecione os filtros</p>
          </DialogTitle>
          <DialogContent className={styles.modal}>
            <DialogContentText id="alert-dialog-description">
              <Select
                className={styles.segmentFilter}
                closeMenuOnSelect={false}
                placeholder={"Filtre os segmentos"}
                isMulti
                onChange={this.handleSelectedOptions}
                options={this.props.segments}
              />
              <div className={styles.twoFiltersGrid}>
                <div className={this.state.noProposalBox} onClick={this.noProposalBoxClick}>
                  <FontAwesomeIcon icon={faCommentSlash} className={styles.noProposalIcon} size="2x" color={this.state.noProposalIcon} />
                  Sem proposta
                </div>
                <div className={this.state.withProposalBox} onClick={this.withProposalBoxClick}>
                  <FontAwesomeIcon icon={faHandHoldingUsd} className={styles.bigIcon} size="2x" color={this.state.withProposalIcon} />
                  Com proposta
                </div>
                <div className={this.state.visitTodayBox} onClick={this.visitTodayBoxClick}>
                  <FontAwesomeIcon icon={faCalendarCheck} className={styles.bigIcon} size="2x" color={this.state.visitTodayIcon} />
                  Visita hoje
                </div>
                <div className={this.state.noVisitTodayBox} onClick={this.noVisitTodayBoxClick}>
                  <FontAwesomeIcon icon={faCalendarTimes} className={styles.bigIcon} size="2x" color={this.state.noVisitTodayIcon} />
                  Sem visita hoje
                </div>
              </div>
              <div className={styles.threeFiltersGrid}>
                <div className={this.state.tpv10Box} onClick={this.tpv10BoxClick}>
                  <FontAwesomeIcon icon={faCoins} className={styles.selected10Icon} size="2x" color={this.state.tpv10Icon} />
                  TPV &lt; 10k
                </div>
                <div className={this.state.tpv1020Box} onClick={this.tpv1020BoxClick}>
                  <FontAwesomeIcon icon={faCoins} className={styles.selected1020Icon1} size="2x" color={this.state.tpv1020Icon} />
                  <FontAwesomeIcon icon={faCoins} className={styles.selected1020Icon2} size="2x" color={this.state.tpv1020Icon} />
                  10k &lt; TPV &lt; 20k
                </div>
                <div className={this.state.tpv20Box} onClick={this.tpv20BoxClick}>
                  <FontAwesomeIcon icon={faCoins} className={styles.selected1020Icon1} size="2x" color={this.state.tpv20Icon} />
                  <FontAwesomeIcon icon={faCoins} className={styles.selected1020Icon2} size="2x" color={this.state.tpv20Icon} />
                  <FontAwesomeIcon icon={faCoins} className={styles.selected20Icon} size="2x" color={this.state.tpv20Icon} />
                  TPV &gt; 20k
                </div>
                <div className={styles.selectAllBox} onClick={this.selectAllBoxClick}>{this.state.selectUnselectMessage}</div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className={styles.modal}>
            <Button color="primary" onClick={this.handleClose}>
              FECHAR
            </Button>
            <Button color="primary" onClick={this.handleFilter}>
              FILTRAR
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

}

export default FilterModal;