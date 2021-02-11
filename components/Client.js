import React, { Component } from 'react';
import { firebaseDB } from '../lib/firebase';
import styles from '../styles/Client.module.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export class Client extends Component {
  
  state = {
    client: {}
  }

  async getClients() {
    let client;
    let firebase = await firebaseDB();
    let snapshot = await firebase
                          .firestore()
                          .collection('clients')
                          .doc(this.props.id)
                          .get();
    client = snapshot.data();
    return client;
  }

  componentDidMount = () => {
    this.getClients().then((data) => {
      this.setState({ client: data });
    });
  }
  
  visitationCheck = (visitToday) => {
    if(visitToday) {
      return <p className={styles.visit}>VISITA HOJE!</p>
    } else {
      return <></>
    }
  }

  render(){

    return (
      <div className={styles.wrapper}>
        {this.visitationCheck(this.state.client.visit_today)}
        <p className={styles.ecName}>{this.state.client.name}</p>

        <p className={styles.infos}><b>{this.state.client.segment}</b></p>
        <p className={styles.infos}>{this.state.client.address}</p>
        <br></br>
        <p className={styles.infos}>Data da última visita: {this.state.client.last_visit}</p>
        
        
        <div className={styles.containerSatisfaction}>
          <p className={styles.containerInfos}>Nível de satisfação</p>
          <div className={styles.progressBarWrapper}>
            <p className={styles.percent}>{this.state.client.satisfaction}%</p>
            <div className={styles.progressBar}>
              <span className={styles.progressBarFill} style={{width: JSON.stringify(this.state.client.satisfaction) + '%'}}>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.containerMigration}>
          <p className={styles.containerInfos}>Percentual de migração</p>
          <CircularProgressbar 
            value={this.state.client.migration} 
            text={`${this.state.client.migration}%`} 
            strokeWidth={6} className={styles.migrationBar} 
            styles={buildStyles({
              strokeLinecap: 'butt',
              textSize: '16px',
              pathTransitionDuration: 0.5,
              pathColor: `#90C63B`,
              textColor: '#ACA9A9',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          />
        </div>
      </div>
    )
  }
}

export default Client;