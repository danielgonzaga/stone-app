import React, { Component } from 'react';
import { firebaseDB } from '../lib/firebase';
import styles from '../styles/List.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, 
         faDollarSign, 
         faHistory, 
         faCalendarDay, 
         faPlus 
       } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';

export class List extends Component {
  
  value = "";

  state = {
    clients: [],
    leads: [],
    typed: ""
  }

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

  loadCustomers = () => {
    this.getClients().then((data) => {

      let clients = [];

      data.forEach((client) => {
        let newClient = { id: client.id, 
                          name: client.name,
                          address: client.address,
                          potential_tpv: client.potential_tpv,
                          segment: client.segment,
                          type: "clients",
                          last_visit: client.last_visit,
                          visit_today: client.visit_today
                        };
        clients.push(newClient);
      })

      let joined = this.state.clients.concat(clients);
      this.setState({ clients: joined })
    });

    this.getLeads().then((data) => {

      let leads = [];

      data.forEach((lead) => {
        let newLead = { id: lead.id,
                        name: lead.name,
                        address: lead.address,
                        potential_tpv: lead.potential_tpv,
                        segment: lead.segment,
                        type: "leads",
                        last_visit: lead.last_visit,
                        visit_today: lead.visit_today
                      };
        leads.push(newLead);
      })

      let joined = this.state.leads.concat(leads);
      this.setState({ leads: joined })
    });
  }

  updateInput = (typed) => {
    this.setState({
      typed: typed
    });
  }

  componentDidMount(){
    this.loadCustomers();
  }

  verifyVisitToday(visitToday) {
    if(visitToday) {
      visitToday = <b>VISITA HOJE!</b>
    } else {
      visitToday = "Sem visita hoje"
    }
    return visitToday
  }

  verifyCustomerType(customerType) {
    if(customerType == "clients") {
      customerType = <p className={styles.clientBox}>Client</p>
    } else if(customerType == "leads") {
      customerType = <p className={styles.leadBox}>Lead</p>
    }
    return customerType
  }

  verifyButtonType(buttonType, id) {
    if(buttonType == "clients") {
      buttonType = <Link href={{
                          pathname: "/client",
                          query: { id: id }
                        }}>
                      <FontAwesomeIcon icon={faPlus} className={styles.plusIcon} size="lg"/>
                    </Link>
    } else if(buttonType == "leads") {
      buttonType = <Link href={{
                          pathname: "/lead",
                          query: { id: id }
                        }}>
                      <FontAwesomeIcon icon={faPlus} className={styles.plusIcon} size="lg"/>
                    </Link>
    }
    return buttonType;
  }

  searchCustomer(clients, leads) {
    
    let customers = clients.concat(leads);

    return customers.map(place => {
      if(((place.name).toLowerCase()).includes((this.state.typed).toLowerCase()) || ((place.address).toLowerCase()).includes((this.state.typed).toLowerCase())) {
        return (
          <div className={styles.card}>
            <div className={styles.cardWrapper}>
              {this.verifyCustomerType(place.type)}
              <p className={styles.titleText}>
                {place.name}
              </p>
              <p className={styles.minorText}>
                {place.address} 
                <br /> 
                <br />
                <div className={styles.cardGrid}>
                  <div>
                    <FontAwesomeIcon icon={faHistory} className={styles.infosIcon} size="sm"/> {place.last_visit}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faDollarSign} className={styles.infosIcon} size="sm"/> R${place.potential_tpv}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCalendarDay} className={styles.infosIcon} size="sm"/> {this.verifyVisitToday(place.visit_today)}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faBuilding} className={styles.infosIcon} size="sm"/> {place.segment}
                  </div>
                </div>
                {this.verifyButtonType(place.type, place.id)}
              </p>
              <br/>
            </div>
          </div>
        );
      }
    })
  }

  render() {
    
    return (
      <div className={styles.container}>
        <input type="text" 
               className={styles.searchBar} 
               value={this.state.typed} 
               onChange={e => this.updateInput(e.target.value)}
               placeholder="&nbsp;&nbsp;Procure pelo nome ou endereço"
        >
        </input>
        <p className={styles.minorText}>Total de ECs: {this.state.clients.length + this.state.leads.length}</p>
        
        {this.searchCustomer(this.state.clients, this.state.leads)}
        
        <br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default List;