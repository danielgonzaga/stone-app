import React, { Component } from 'react';
import { firebaseDB } from '../lib/firebase';
import styles from '../styles/Lead.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, 
         faSnowflake, 
         faExclamation,
         faCommentsDollar } from '@fortawesome/free-solid-svg-icons';
import 'react-circular-progressbar/dist/styles.css';
import ProposalModal from './ProposalModal';

export class Lead extends Component {
  
  state = {
    lead: {},
    showProposalModal: false
  }

  async getLeads() {
    let lead;
    let firebase = await firebaseDB();
    let snapshot = await firebase
                          .firestore()
                          .collection('leads')
                          .doc(this.props.id)
                          .get();
    lead = Object.assign({
            id: snapshot.id
          }, snapshot.data())
    return lead;
  }

  componentDidMount = () => {
    this.getLeads().then((data) => {
      this.setState({ lead: data })
    });
  }
  
  visitationCheck = (visitToday) => {
    if(visitToday) {
      return <p className={styles.visit}>VISITA HOJE!</p>
    } else {
      return <></>
    }
  }

  handleProposalModal = () => {
    this.setState({
      showProposalModal: !this.state.showProposalModal
    });
  }

  render(){
    let icon;
    let color;
    if(this.state.lead.negotiation_status == "quente") {
      icon = faFire;
      color = "#FFBA31";
    } else if ((this.state.lead.negotiation_status == "frio")) {
      icon = faSnowflake
      color = "#C7FBFF";
    } else if ((this.state.lead.negotiation_status == "obs")) {
      icon = faExclamation
      color = "yellow";
    }

    return (
      <div className={styles.wrapper}>
        {this.state.showProposalModal &&  <ProposalModal leadId={this.state.lead.id} handleProposalModal={this.handleProposalModal}/>}
        {this.visitationCheck(this.state.lead.visit_today)}
        <p className={styles.ecName}>{this.state.lead.name}</p>

        <p className={styles.infos}><b>{this.state.lead.segment}</b></p>
        <p className={styles.infos}>{this.state.lead.address}</p>
        <br></br>
        <p className={styles.infos}>Quantidade de visitas: {this.state.lead.qtd_visits}</p>
        <p className={styles.infos}>Data da última visita: {this.state.lead.last_visit}</p>
        <div className={styles.containerMigration}>
          <p className={styles.containerInfos}>Status da negociação</p>
          <div className={styles.outerCircle}>
            <FontAwesomeIcon className={styles.icon} icon={icon} size="2x" color={color} />
          </div>
        </div>
        <br />
        <p className={styles.infos}>
          <b>TPV Potencial</b>
          <br />
          R${this.state.lead.potential_tpv}
        </p>
        <FontAwesomeIcon className={styles.iconProposal} icon={faCommentsDollar} size="3x" color="#757575" onClick={this.handleProposalModal}/>
      </div>
    )
  }
}

export default Lead;