// Initialize Firebase
var config = {
  apiKey: "AIzaSyBnGL1bhyZRc8ggTM-vNrDFPDe84SNmqkU",
  authDomain: "vosm-9a086.firebaseapp.com",
  databaseURL: "https://vosm-9a086.firebaseio.com",
  projectId: "vosm-9a086",
  storageBucket: "vosm-9a086.appspot.com",
  messagingSenderId: "317683484107"
};
firebase.initializeApp(config);

class RegisterInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isRegistered = <p>hi there - is registered</p>
    const isNotRegistered = (
      <div>
        <h5>Registration Fees (before July 4th):</h5>
        <ul className="price-list">
          <li>ACVO/ECVO Diplomate - $300</li>
          <li>Ophthalmology Resident or Intern/Presenter - $200</li>
          <li>Nonboarded certified foreign ophthalmologist - $400</li>
          <small>Fees after July 4th: +$50, Onsite registration: +$100</small>
        </ul>
        <p>Registration for this event includes Friday night welcome reception,
          breakfast, plated lunch, breaks with coffee and refreshments on Sat/Sun, keynote lecture and
          proceedings. Approximately __ hours of RACE Credits.</p>
      </div>
    );
    // if (this.props.registered)
    //   return (isRegistered);
    // else
    return (isNotRegistered);
  }


} // end RegisterInfo

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

    let thankyou = '';
    console.log(this.props.category);

    switch (this.props.category) {
      case 'aecvodip':
      thankyou = (
      <div>
        <h3>Thank you for registering!</h3>
        <h4>Now you have to pay! Please click the link below to be taken to the payment page.</h4>
        <form name="PrePage" method="post" action="https://scotest.authorize.net/payment/CatalogPayment.aspx"> 
          <input type="hidden" name="LinkId" value="3600fe04-1cb3-4bfc-b68c-3897623a97a5" /> 
          <div className="col-md-6 col-md-offset-2">
            <button className="btn btn-block btn-lg btn-fill btn-success">Pay here!</button>
          </div>
        </form>
      </div>
      );
        break;
      case 'houseofficer':
      thankyou = (
        <div>
          <h3>Thank you for registering!</h3>
          <h4>Now you have to pay! Please click the link below to be taken to the payment page.</h4>
          <form name="PrePage" method = "post" action = "https://scotest.authorize.net/payment/CatalogPayment.aspx"> 
            <input type = "hidden" name = "LinkId" value ="cc6ead9d-9600-467c-a45e-d8e6e56e96a5" />
            <div className="col-md-6 col-md-offset-2">
              <button className="btn btn-block btn-lg btn-fill btn-success">Pay here!</button>
            </div>
          </form>
        </div>
      );
        break;
      case 'other':
      thankyou = (
        <div>
          <h3>Thank you for registering!</h3>
          <h4>Now you have to pay! Please click the link below to be taken to the payment page.</h4>
          <form name="PrePage" method = "post" action = "https://scotest.authorize.net/payment/CatalogPayment.aspx"> 
            <input type = "hidden" name = "LinkId" value ="cc56d4e7-736a-4a7d-ba71-e7860444a9a9" /> 
            <div className="col-md-6 col-md-offset-2">
              <button className="btn btn-block btn-lg btn-fill btn-success">Pay here!</button>
            </div>
          </form>
        </div>
        );
        break;
      default:
       thankyou = (
        <div>
          <h3>Something went wrong. Please email vosm@webfaction.com</h3>
        </div>
        );
        break;
    }
    
    if (this.props.registered)
      return thankyou;
    if (!this.props.registered)
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
              onChange={this.handleInputChange} required/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your personal email address"
              value={this.props.email}
              onChange={this.handleInputChange} required/>
          </div>
          <div className="form-group">
            <label htmlFor="company">Company/School</label>
            <input
              type="text"
              name="company"
              className="form-control"
              placeholder="Who you work for"
              value={this.props.company}
              onChange={this.handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="Category">Category</label>
            <select required
              className="form-control"
              name="category"
              value={this.props.category}
              onChange={this.handleInputChange}>
              <option value="">Select One</option>
              <option value="aecvodip" selected>ACVO/ECVO Diplomate</option>
              <option value="houseofficer">Ophthalmology Resident or Intern/Presenter</option>
              <option value="other">Nonboarded certified foreign ophthalmologists</option>
            </select>
          </div>
          <div className="submit">
            <input type="submit" className="btn btn-info btn-fill" defaultValue="Register!" />
          </div>
        </form>
      );
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
      category: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.firebaseRef = firebase.database().ref('attendees');
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
    console.log('hi handling submit');
    this.setState({ registered: true })
    console.log(this.state);
    this.firebaseRef.push({
      name: this.state.name,
      email: this.state.email,
      company: this.state.company,
      category: this.state.category
    });
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
            onInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit} />
        </div>
        <div className="col-md-6">
          <RegisterInfo
            category={this.state.category}
            registered={this.state.registered} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <RegApp />,
  document.getElementById('registerApp')
);
