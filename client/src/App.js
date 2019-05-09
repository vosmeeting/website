import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { base } from './base'
import { WETLABS, REGISTRATION } from './constants'
import Checkout from './Checkout';
import Log from './log';
import Routes from "./Routes";
import './App.css';
import config from './config';


/**
 * Helper function to calculate the registration fee based on the Category of Registration selected
 */
const getRegCost = (category) => { 
  Log('getRegCost called');
  switch (category) {
    case REGISTRATION.CATEGORY.DIPLOMATE:
      return REGISTRATION.COST.DIPLOMATE;
    case REGISTRATION.CATEGORY.PRESENTER:
      return REGISTRATION.COST.PRESENTER;
    case REGISTRATION.CATEGORY.RESIDENT:
      return REGISTRATION.COST.RESIDENT;
    case REGISTRATION.CATEGORY.OTHER:
      return REGISTRATION.COST.OTHER;
    default:
      Log('No Category Selected for getRegCost(): ' + category);
      return 0;
  }
};


const getCategoryText = (category) => { 
  Log('getCategoryText:', category)
  switch (category){
    case REGISTRATION.CATEGORY.DIPLOMATE:
      return 'ACVO/ECVO Diplomate/Board Eligible';
    case REGISTRATION.CATEGORY.PRESENTER:
      return 'Speaker';
    case REGISTRATION.CATEGORY.RESIDENT:
      return 'Resident/Ophthalmology Intern';
    case REGISTRATION.CATEGORY.OTHER:
      return 'Non-Diplomates';
  }};


const getOrderText = (name, email, category, wetlab1, wetlab2, wetlab3, wetlab4, reception) => {      
    const registrationOrderText = `VOSM Registration - ${getCategoryText(category)} Registration for ${name} (${email})`
    let labsOrderText = '';
    if (wetlab1 != WETLABS.NO){
      labsOrderText += ' | Phacodynamics Lecture';
    }
    if (wetlab2 != WETLABS.NO){
      labsOrderText += ' | Phacodynamics Wet Lab-' + 
        (wetlab2 === WETLABS.GR1 ? 'Group 1' : 'Group 2');
    }
    if (wetlab3 != WETLABS.NO){
      labsOrderText += ' | Anesthetic Complications Management-' + 
        (wetlab3 === WETLABS.GR1 ? 'Group 1' : 'Group 2');
    }
    if (wetlab4 != WETLABS.NO){
      labsOrderText += ' | Endothelial Transplantation-' + 
        (wetlab4 === WETLABS.OBSERVER ? 'Symposium' : 'Full-Participant');
    }
    const receptionText = ' | Reception: '+ reception
    return registrationOrderText + labsOrderText + receptionText;
  }


/**
 * Helper function to calculate the Web Lab consts based on the selected wet lab form options
 */
function getWebLabCost(props){
  Log('getWebLabCost() - called with:', props);

  const category = props.category;
  const isResident = category === REGISTRATION.CATEGORY.RESIDENT;

  let amt = 0;
  // 1. Phacodynamics Lecture - $100 (residents: $25)
  if (props.wetlab1 === WETLABS.YES) {
    if (isResident) amt += 25
    else amt += 100;
  }
  // 2. Phacodynamics Wet Lab - $100 (residents: $25)
  if (props.wetlab2 === WETLABS.GR1 || props.wetlab2 === WETLABS.GR2){
    if (isResident) amt += 25
    else amt += 100;
  }
  // 3. Updates on anesthetic complication management lecture - $50
  if (props.wetlab3 === WETLABS.GR1 || props.wetlab3 === WETLABS.GR2){
    amt += 50;
  }
  // 4. Endothelial Transplantation Symposium - $100 ($50 for residents)
  if (props.wetlab4 === WETLABS.OBSERVER){
    if (isResident) amt += 50
    else amt += 100;
  }
  // 4. Endothelial Transplantation Wet Lab - $800
  if (props.wetlab4 === WETLABS.PARTICIPANT){
    amt += 800;
  }

  return amt;
}


/**
 * RegisterInfo Component
 * takes: dipRegistrantNumber, otherRegistrantNumber, registered
 * displays: pricing details and options if not registered;
 *      otherwise shows general payment details.
 */
class RegisterInfo extends Component {

  render() {
    const isRegistered = (
      <div>
        <h5>If paying by credit card</h5>
        <p>You should receive a receipt from Stripe in a few minutes after the payment is processed. If you don't receive the email or if there's an error in payment - please <a href="mailto:vetophthosurgerymeeting@gmail.com">email us</a> with details. <b>You may close this window after receiving the email receipt.</b></p> 
        <h5>Cancellation Policy</h5>
        <p>Cancellations received by June 4th  will receive a full refund less a 10% administrative fee. 
          Cancellations received between June 4th-July 4th will receive a 50% refund. No cancellations will be refunded after July 4th. 
          All cancellations must be received in writing via <a href="mailto:vetophthosurgerymeeting@gmail.com">email</a> or mail.</p>
      </div>
    );
    const isNotRegistered = (
      <div>
        <h5><b>Registration Fees:</b></h5>
        <ul className="price-list">
          <li>ACVO/ECVO Diplomate/Board Eligible - ${REGISTRATION.COST.DIPLOMATE}</li>
          <li>Speaker - ${REGISTRATION.COST.PRESENTER}</li>
          <li>Resident/Ophthalmology Intern - ${REGISTRATION.COST.RESIDENT}</li>
          <li>Non-Diplomates - ${REGISTRATION.COST.OTHER}</li>
          <small>After July 4th: +$50</small><br/>
          <small>Onsite registration: +$100</small>
        </ul>
        <p><b>We are an approved AAVSB-provider for RACE Credits; final credit hours are still pending. Last year the program had 11hs of RACE credits.</b></p>
        <p>Number of available registration spots: <b>{this.props.availability.registration}</b></p>
        {/*
        <p>Number of available diplomate registration spots: <b>{this.props.dipRegistrantNumber}</b></p>
        <p>Number of available house officer or other registration spots: <b>{this.props.otherRegistrantNumber}</b></p>
        */}
          <hr/>
        <h5><b>Extracurricular Wet Labs/Lectures</b></h5>
        <p>This year we are happy to announce we will be offering a number of additional lectures and hands-on opportunities.</p>
        <p><i>Attendees can join more than one wet lab if desired.</i></p>
        <b>1. Principles of Phacodynamics Lecture (Dr. Barry Seibel, MD)</b>
        <div className="hanging-text">
            <p>(Friday 10:00am-12:00pm)</p>
            <p><b>{this.props.wetlab1Number}</b> seats available</p>
            <p>Fee: $100 (residents: $25)</p>
        </div>    
        <b>2. Principles of Phacodynamics Wet Lab (Dr. Barry Seibel, MD)</b>
        <div className="hanging-text">
            <p>(Group 1: Friday 2:00-3:00pm or Group 2: 3:30-4:30pm)</p>
            <p><b>{this.props.wetlab2Gr1Number}</b> seats available for Group 1</p>
            <p><b>{this.props.wetlab2Gr2Number}</b> seats available for Group 2</p>
            <p>5-10 B+L machines present depending on the number of attendees.</p>
            <p>Fee: $100 (residents: $25)</p>
        </div>    
        <b>3. Updates on anesthetic complications management lecture (Dr. Kristen Messenger, DVM, PhD, DACVAA, DACVCP)</b>
        <div className="hanging-text">
            <p>(Group 1: Friday 2:30-3:30pm, or Group 2: 4:00-5:00pm)</p>
            <p><b>{this.props.wetlab3Gr1Number}</b> seats available for Group 1</p>
            <p><b>{this.props.wetlab3Gr2Number}</b> seats available for Group 2</p>
            <p>Fee: $50</p>
        </div>    
        <b>4. Endothelial Transplantation Symposium/Wet Lab (Dr. Micki Armour VMD, DACVO)</b>
        <div className="hanging-text">
            <p>(Friday 8:00am-12:00pm)</p>
            <p>Symposium (8:00am-9:00am)</p>
            <p><b>{this.props.wetlab4Gr1Number}</b> seats available</p>
            <p>Fee: $100 ($50 for residents)</p>
            <p>Wet Lab Participant* (hands-on 9:00am-Noon)</p>
            <p><b>{this.props.wetlab4Gr2Number}</b> seats available</p>
            <p>Fee: $800</p>
            <p>*Required: Surgical DSEK Instruments</p>
            <p><i>After being selected as a wet lab participant, you will be contacted by Dr. Micki Armour regarding purchase of a DSEK kit and further details regarding the lab.</i></p>
        </div>    
        <br/>
        <p><b><u>We reserve the right to change your groups or cancel a lecture/wet lab based on number of attendees or unforeseen circumstances and refund your fees.</u></b></p>
      </div>
    );

    return this.props.registered ? isRegistered : isNotRegistered;
  }


} // end RegisterInfo

/**
 * RegisterForm
 * 
 */
class RegisterForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(event) {
    this.props.handleSubmit(event)
  }

  handleInputChange(event) {
    this.props.onInputChange(event);
  }

  render() {

    
    const soldOut = (this.props.availability.registration <= 0);

    const dipdisabled = (this.props.dipRegistrantNumber <= 0);
    const otherdisabled = (this.props.otherRegistrantNumber <= 0);

    const wetlab1Disabled = (this.props.wetlab1Number <= 0);
    const wetlab2Gr1Disabled = (this.props.wetlab2Gr1Number <= 0);
    const wetlab2Gr2Disabled = (this.props.wetlab2Gr2Number <= 0);
    const wetlab3Gr1Disabled = (this.props.wetlab3Gr1Number <= 0);
    const wetlab3Gr2Disabled = (this.props.wetlab3Gr2Number <= 0);
    const wetlab4Gr1Disabled = (this.props.wetlab4Gr1Number <= 0);
    const wetlab4Gr2Disabled = (this.props.wetlab4Gr2Number <= 0);

    let amount = 0;
    amount += getRegCost(this.props.category);
    Log('here is the amount (before):' + amount);
    amount += getWebLabCost(this.props);
    Log('here is the amount (after):' + amount);

    Log('props going to payment link', this.props);  

    const orderTxt = getOrderText(this.props.name, this.props.email, this.props.category, 
      this.props.wetlab1, this.props.wetlab2, this.props.wetlab3, this.props.wetlab4, this.props.reception);
    Log('orderTxt:', orderTxt)


    const paymentLink = (
      <div>
            <h3>Thank you for registering!</h3>
            <h2><b>Please click the link below to get the payment pop-up window for ${amount} if paying by credit-card.</b></h2>
            <div className="row">
              <div className="col-md-8 col-md-offset-3">
                <Checkout
                  name='Vet Ophtho Surgery Meeting'
                  description={orderTxt}
                  email={this.props.email}
                  amount={amount}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 col-md-offset-4">
                <h6>-OR-</h6>
              </div>
            </div>
            <div>Pay by check - ${amount}: </div>
              <address>
                <strong>MDVM Solutions</strong><br/>
                2720 S. Highland Ave #603<br/>
                Lombard, IL USA 60148<br/>
              </address>
              <p>(Postmarked by June 4th for early registration. we will send you a confirmation email once the check has arrived. If you have any question or concerns do not hesitate to email us at: vetophthosurgerymeeting@gmail.com, or Dr. Enry Garcia over the phone at 970-232-5225)</p>
      </div>
    );

    const soldOutMessage = ( 
      <p> Sorry this year's conference is <b>Sold Out</b></p>
    );


    if (this.props.registered){
      return paymentLink;
    }
    else if (!this.props.registered && soldOut){
      return soldOutMessage;
    }
    else { //if (!this.props.registered) {
      return (
        <form role="form" id="contact-form" method="post" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="First Name and Last Name"
              value={this.props.name}
              onChange={this.handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your personal email address"
              value={this.props.email}
              onChange={this.handleInputChange} required />
              <p>This email will be used for all comunications throughout the year and for updates.</p>
          </div>
          <div className="form-group">
            <label htmlFor="company">Clinic/School/Company</label>
            <input
              type="text"
              name="company"
              className="form-control"
              placeholder="Who you work for"
              value={this.props.company}
              onChange={this.handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              name="country"
              className="form-control"
              placeholder="Where you are from (e.g. United States)"
              value={this.props.country}
              onChange={this.handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="Category">Category of Registration</label>
            <select required
              className="form-control"
              name="category"
              value={this.props.category}
              onChange={this.handleInputChange}>
              <option value="">Select One</option>
              <option value={REGISTRATION.CATEGORY.DIPLOMATE} disabled={dipdisabled} >ACVO/ECVO Diplomate/Board Eligible (${REGISTRATION.COST.DIPLOMATE})</option>
              <option value={REGISTRATION.CATEGORY.PRESENTER} disabled={dipdisabled} >Speaker (${REGISTRATION.COST.PRESENTER})</option>
              <option value={REGISTRATION.CATEGORY.RESIDENT} disabled={otherdisabled} >Resident/Ophthalmology Intern (${REGISTRATION.COST.RESIDENT})</option>
              <option value={REGISTRATION.CATEGORY.OTHER} disabled={otherdisabled} >Non-Diplomates (${REGISTRATION.COST.OTHER})</option>
            </select>
          </div>
          <div className="form-group">
            <label>Will you be attending any extra lectures or wet labs?</label><br/>
            <div id="wetlabs-form" className="wetlabs">
              <div className="form-group">
                <label htmlFor="Wetlab1">1. Phacodynamics Lecture - $100 (residents: $25)</label><br/>
                {wetlab1Disabled ? <p> [Sold Out] </p> :
                  <div className="radio-inline">                    
                    <label className="radio-inline">
                      <input type="radio" name="wetlab1" value={WETLABS.YES}
                      checked={this.props.wetlab1 === WETLABS.YES}
                      onChange={this.handleInputChange} /> Friday 10am-Noon
                    </label><br/>
                    <label className="radio-inline">
                      <input type="radio" name="wetlab1" value={WETLABS.NO}
                      checked={this.props.wetlab1 === WETLABS.NO}
                      onChange={this.handleInputChange}/> Not Attending
                    </label>
                  </div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="Wetlab2">2. Phacodynamics Wet Lab - $100 (residents: $25)</label><br/>
                {(wetlab2Gr1Disabled && wetlab2Gr2Disabled) ? <p> [Sold Out] </p> :
                  <div className="radio-inline">
                    {wetlab2Gr1Disabled ?<label className="radio-inline">Group 1: [Sold Out]</label> :
                      <label className="radio-inline">
                        <input type="radio" name="wetlab2" value={WETLABS.GR1}
                        checked={this.props.wetlab2 === WETLABS.GR1}
                        onChange={this.handleInputChange}/> Group 1: Friday 2-3pm
                      </label>
                    }
                    <br/>
                    {wetlab2Gr2Disabled ? <label className="radio-inline">Group 2: [Sold Out]</label> :
                      <label className="radio-inline">
                        <input type="radio" name="wetlab2" value={WETLABS.GR2}
                        checked={this.props.wetlab2 === WETLABS.GR2}
                        onChange={this.handleInputChange}/> Group 2: Friday 3:30-4:30pm
                      </label>
                    }
                    <br/>
                    <label className="radio-inline">
                      <input type="radio" name="wetlab2" value={WETLABS.NO}
                      checked={this.props.wetlab2 === WETLABS.NO}
                      onChange={this.handleInputChange}/> Not Attending
                    </label>
                  </div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="Wetlab3">3. Updates on anesthetic complications management lecture - $50</label><br/>
                {(wetlab3Gr1Disabled && wetlab3Gr2Disabled) ? <p> [Sold Out] </p> :
                  <div className="radio-inline">
                    {wetlab3Gr1Disabled ? <label className="radio-inline">Group 1: [Sold Out]</label> :
                      <label className="radio-inline">
                        <input type="radio" name="wetlab3" value={WETLABS.GR1}
                        checked={this.props.wetlab3 === WETLABS.GR1}
                        onChange={this.handleInputChange} required/> Group 1: Friday 2:30-3:30pm
                      </label>
                    }
                    <br/>
                    {wetlab2Gr2Disabled ? <label className="radio-inline">Group 2: [Sold Out]</label> :
                      <label className="radio-inline">
                        <input type="radio" name="wetlab3" value={WETLABS.GR2}
                        checked={this.props.wetlab3 === WETLABS.GR2}
                        onChange={this.handleInputChange} required/> Group 2: Friday 4-5pm
                      </label>
                    }
                    <br/>
                    <label className="radio-inline">
                      <input type="radio" name="wetlab3" value={WETLABS.NO} 
                      checked={this.props.wetlab3 === WETLABS.NO}
                      onChange={this.handleInputChange}/> Not Attending
                    </label>
                  </div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="Wetlab4">4. Endothelial Transplantation Symposium/Wet Lab - $100 (residents: $50) / $800</label><br/>
                {(wetlab4Gr1Disabled && wetlab4Gr2Disabled) ? <p> [Sold Out] </p> :
                  <div className="radio-inline">
                    {wetlab4Gr1Disabled ? <label className="radio-inline">Symposium Only: [Sold Out]</label> :
                      <label className="radio-inline">
                        <input type="radio" name="wetlab4" value={WETLABS.OBSERVER}
                        checked={this.props.wetlab4 === WETLABS.OBSERVER}
                        onChange={this.handleInputChange} required/> Symposium Only: Friday 8-9am
                      </label>
                    }
                    <br/>
                    {wetlab4Gr2Disabled ? <label className="radio-inline">Wet Lab: [Sold Out]</label> :
                      <label className="radio-inline">
                        <input type="radio" name="wetlab4" value={WETLABS.PARTICIPANT} 
                        checked={this.props.wetlab4 === WETLABS.PARTICIPANT}
                        onChange={this.handleInputChange} required/> Symposium and Wet Lab Participant*: Friday 8am-Noon
                      </label>
                    }
                    <br/>
                    <label className="radio-inline">
                      <input type="radio" name="wetlab4" value={WETLABS.NO} 
                      checked={this.props.wetlab4 === WETLABS.NO}
                      onChange={this.handleInputChange}/> Not Attending
                    </label>
                    <br/><small>*The practical portion of the wet-lab ($800) is for diplomates only</small>
                  </div>
                }
              </div>

            </div>

          </div>
          <div className="form-group">
            <label htmlFor="Reception">Will you be attending the welcome reception (Jul 26th, 6-9pm)?</label>
            <div className="radio-inline">
              <label className="radio-inline">
                <input type="radio" name="reception" id="inlineRadio1" value={WETLABS.YES} onChange={this.handleInputChange} required/> Yes!
              </label>
              <label className="radio-inline">
                <input type="radio" name="reception" id="inlineRadio2" value={WETLABS.NO} onChange={this.handleInputChange}/> Alas, no. 
              </label>
            </div>
          </div>          
          <div className="submit">
            <input type="submit" className="btn btn-info btn-fill" defaultValue={"Register! ($" + amount + ")"} />
          </div>
        </form>
      );
    }
  }
};

class RegApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      registered: false,
      name: '',
      email: '',
      company: '',
      category: '',
      country: '',
      reception: WETLABS.NO,
      availability: {},
      dipRegistrantNumber: '',
      otherRegistrantNumber: '',
      wetlab1Number: 0,
      wetlab2Gr1Number: 0,
      wetlab2Gr2Number: 0,
      wetlab3Gr1Number: 0,
      wetlab3Gr2Number: 0,
      wetlab4Gr1Number: 0,
      wetlab4Gr2Number: 0,
      wetlab1: WETLABS.NO,
      wetlab2: WETLABS.NO,
      wetlab3: WETLABS.NO,
      wetlab4: WETLABS.NO
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
    Log('RegApp Constructed!', config);
  }

//  componentDidMount(){
  componentWillMount() {
    Log('base', base);
    this.firebaseRef = base.initializedApp.database().ref('attendees');
    this.ref = base.syncState('dipRegistrantNumber', {
      context: this,
      state: 'dipRegistrantNumber'
    });
    this.ref2 = base.syncState('otherRegistrantNumber', {
      context: this,
      state: 'otherRegistrantNumber'
    });

    // a single container for availability counts
    base.syncState('availability', {
      context: this,
      state: 'availability'
    });

    base.syncState('wetlab1Number', {
      context: this,
      state: 'wetlab1Number'
    });
    base.syncState('wetlab2Gr1Number', {
      context: this,
      state: 'wetlab2Gr1Number'
    });
    base.syncState('wetlab2Gr2Number', {
      context: this,
      state: 'wetlab2Gr2Number'
    });
    base.syncState('wetlab3Gr1Number', {
      context: this,
      state: 'wetlab3Gr1Number'
    });
    base.syncState('wetlab3Gr2Number', {
      context: this,
      state: 'wetlab3Gr2Number'
    });
    base.syncState('wetlab4Gr1Number', {
      context: this,
      state: 'wetlab4Gr1Number'
    });
    base.syncState('wetlab4Gr2Number', {
      context: this,
      state: 'wetlab4Gr2Number'
    });

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ registered: true })
    this.firebaseRef.push({
      name: this.state.name,
      email: this.state.email,
      company: this.state.company,
      country: this.state.country,
      category: this.state.category,
      reception: this.state.reception,
      wetlab1: this.state.wetlab1,
      wetlab2: this.state.wetlab2,
      wetlab3: this.state.wetlab3,
      wetlab4: this.state.wetlab4
    });

    const availability = {...this.state.availability};
    availability.registration--;
    this.setState({ availability })

    switch (this.state.category) {
      case 'aecvodip':
      case 'presenter':
        this.setState({
          dipRegistrantNumber: this.state.dipRegistrantNumber-1
        });
      break;
      case 'other':
      case 'houseofficer':
        this.setState({
          otherRegistrantNumber: this.state.otherRegistrantNumber-1
        });
        break;
      default:
        Log('Cannot decrement count');
        break;
    }

    // 1. Phacodynamics Lecture - 150 seats
    if (this.state.wetlab1 === WETLABS.YES) {
      this.setState({
        wetlab1Number: this.state.wetlab1Number-1
      });
    }
    // 2. Phacodynamics Wet Lab - 20 seats each group
    if (this.state.wetlab2 === WETLABS.GR1){
      this.setState({
        wetlab2Gr1Number: this.state.wetlab2Gr1Number-1
      });
    }
    if (this.state.wetlab2 === WETLABS.GR2){
      this.setState({
        wetlab2Gr2Number: this.state.wetlab2Gr2Number-1
      });
    }
    // 3. Updates on anesthetic complication management lecture - 40 seats each group
    if (this.state.wetlab3 === WETLABS.GR1){
      this.setState({
        wetlab3Gr1Number: this.state.wetlab3Gr1Number-1
      });
    }
    if (this.state.wetlab3 === WETLABS.GR2){
      this.setState({
        wetlab3Gr2Number: this.state.wetlab3Gr2Number-1
      });
    }
    // 4. Endothelial Transplantation Symposium - 40 seats
    if (this.state.wetlab4 === WETLABS.OBSERVER){
      this.setState({
        wetlab4Gr1Number: this.state.wetlab4Gr1Number-1
      });
    }
    // 4. Endothelial Transplantation Wet Lab - 10 seats
    if (this.state.wetlab4 === WETLABS.PARTICIPANT){
      this.setState({
        wetlab4Gr2Number: this.state.wetlab4Gr2Number-1
      });
    }
  
  }


  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <RegisterForm
            name={this.state.name}
            email={this.state.email}
            company={this.state.company}
            category={this.state.category}
            registered={this.state.registered}
            reception={this.state.reception}
            country={this.state.country}
            onInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit} 
            availability={this.state.availability}
            dipRegistrantNumber={this.state.dipRegistrantNumber}
            otherRegistrantNumber={this.state.otherRegistrantNumber}
            wetlab1Number={this.state.wetlab1Number}
            wetlab2Gr1Number={this.state.wetlab2Gr1Number}
            wetlab2Gr2Number={this.state.wetlab2Gr2Number}
            wetlab3Gr1Number={this.state.wetlab3Gr1Number}
            wetlab3Gr2Number={this.state.wetlab3Gr2Number}
            wetlab4Gr1Number={this.state.wetlab4Gr1Number}
            wetlab4Gr2Number={this.state.wetlab4Gr2Number}
            wetlab1={this.state.wetlab1}
            wetlab2={this.state.wetlab2}
            wetlab3={this.state.wetlab3}
            wetlab4={this.state.wetlab4}
          />
        </div>
        <div className="col-md-6">
          <RegisterInfo
            category={this.state.category}
            registered={this.state.registered}
            availability={this.state.availability}
            dipRegistrantNumber={this.state.dipRegistrantNumber}
            otherRegistrantNumber={this.state.otherRegistrantNumber}
            wetlab1Number={this.state.wetlab1Number}
            wetlab2Gr1Number={this.state.wetlab2Gr1Number}
            wetlab2Gr2Number={this.state.wetlab2Gr2Number}
            wetlab3Gr1Number={this.state.wetlab3Gr1Number}
            wetlab3Gr2Number={this.state.wetlab3Gr2Number}
            wetlab4Gr1Number={this.state.wetlab4Gr1Number}
            wetlab4Gr2Number={this.state.wetlab4Gr2Number}
            />
        </div>
      </div>
    );
  }
}


export default withRouter(RegApp);