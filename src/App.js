import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class Input extends Component {
  constructor () {
    super();
    this.state={
      typedName:'',
      typedPhone:'',
      typedBirthday:''
    }
  }
  handleName (event){
    this.setState({
      typedName:event.target.value,
    })
  }
  handlePhone (event){
    this.setState({
      typedPhone:event.target.value,
    })
  }
  handleBirthday (event){
    this.setState({
      typedBirthday:event.target.value,
    })
  }

  handleSubmit (){
    this.props.addContact(this.state.typedName, this.state.typedPhone, this.state.typedBirthday);
    //remove value
    this.setState({
      typedName:'',
      typedPhone:'',
      typedBirthday:''
    })
  }

  render(){
    return (
      <div>
        <input className="input" type="text" placeholder="Name" onChange={(event)=>this.handleName(event)} value={this.state.typedName}/>
        <input className="input" type="text" placeholder="Phone" onChange={(event)=>this.handlePhone(event)} value={this.state.typedPhone}/>
        <input className="input" type="date" placeholder="Birthday" onChange={(event)=>this.handleBirthday(event)} value={this.state.typedBirthday}/>
        <input className="input" type="submit" value="Create New" onClick={()=>this.handleSubmit()}/>
      </div>
    )
  }
}

class Contact extends Component {
  constructor (props){
    super(props);
    this.state={
      edit:false
    }
  }

  edit (){
    this.setState({
      edit: !this.state.edit
    })
  }

  render () {
    return (
      <div className="contact-box">
        <div>Name: {this.props.name}</div>
        <div>Phone:{this.props.phone}</div>
        <div>Birthday:{this.props.birthday}</div>
        <button onClick={()=>this.props.delete(this.props.id)}>Delete Contact</button>
        <button onClick={()=>this.edit()}>Edit Contact</button>
        {this.state.edit? <EditField toggleEdit={()=>this.edit()} edit={(id,name,phone,birth)=>this.props.edit(id,name,phone,birth)} id={this.props.id}/> : null }
      </div>
    )
  }
}

class ContactList extends Component {
  render (){
    return (
      <div>
        {this.props.contacts.map((contact,index)=><Contact delete={(id)=>this.props.delete(id)} edit={(id,name,phone,birth)=>this.props.edit(id,name,phone,birth)} id={contact._id} key={contact._id} name={contact.name} phone={contact.phone}
          birthday={contact.birthday.substr(0,10)} />)}
      </div>
    )
  }
}

class EditField extends Component {
  constructor () {
    super();
    this.state={
      typedName:'',
      typedPhone:'',
      typedBirthday:''
    }
  }
  handleName (event){
    this.setState({
      typedName:event.target.value,
    })
  }
  handlePhone (event){
    this.setState({
      typedPhone:event.target.value,
    })
  }
  handleBirthday (event){
    this.setState({
      typedBirthday:event.target.value,
    })
  }

  handleSubmit (){
    this.props.edit(this.props.id, this.state.typedName, this.state.typedPhone, this.state.typedBirthday);
    this.props.toggleEdit();
  }
  render () {
    return (
      <div>
        <input className="input" type="text" placeholder="Name" onChange={(event)=>this.handleName(event)} value={this.state.typedName}/>
        <input className="input" type="text" placeholder="Phone" onChange={(event)=>this.handlePhone(event)} value={this.state.typedPhone}/>
        <input className="input" type="date" placeholder="Birthday" onChange={(event)=>this.handleBirthday(event)} value={this.state.typedBirthday}/>
        <input className="input" type="submit" value="Edit" onClick={()=>this.handleSubmit()}/>
      </div>
    )
  }
}

class Search extends Component {
  constructor () {
    super();
    this.state={
      typedName:''
    }
  }

  handleChange(event){
    this.setState({
      typedName:event.target.value,
    })
    this.props.search(event.target.value);
  }

  render () {
    return (
      <div>
        Search by Name: <input onChange={(event)=>this.handleChange(event)} className="input" type="text" value={this.state.typedName}/>
      </div>
    )
  }
}

class App extends Component {
  constructor (){
    super();
    this.state={
      contacts:[],
    }
  }

  componentDidMount (){
    axios.get('/all')
      .then(response => {
        this.setState({
          contacts:response.data
        })
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  addContact (name, phone, birth){
    axios.post('/add',{name,phone,birth})
      .then(response => {
        this.setState({
          contacts: this.state.contacts.concat(response.data)
        })
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  deleteContact (id){
    axios.post('/delete',{id:id})
      .then(response=>{
        if(response.data.success === true){
          let newContacts = this.state.contacts.map(contact=>Object.assign({},contact));
          newContacts=newContacts.filter(contact=>(contact._id !== id));
          this.setState({
            contacts:newContacts
          })
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  editContact (id,name, phone, birth) {
    axios.post('/edit',{id,name,phone,birth})
     .then(response=>{
       if(response.data.success === true){
         let newContacts = this.state.contacts.map(contact=>{
           if(contact._id === id) {
             return {_id:id, name: name, phone: phone, birthday: birth};
           } else {
             return Object.assign({},contact)
           }
         });
         this.setState({
           contacts:newContacts
         })
       }
     })
     .catch((err)=>{
       console.log(err);
     })
  }

  search(subString){
    console.log('search');
    axios.get('/all')
      .then(response => {
        let result = response.data.filter(contact=>contact.name.indexOf(subString) !== -1);
        this.setState({
          contacts:result
        })
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Contacts</h1>
        </header>
        <Search search={(subString)=>this.search(subString)}/>
        <ContactList delete={(id)=>this.deleteContact(id)} edit={(id, name, phone, birth)=>this.editContact(id, name, phone, birth)} contacts={this.state.contacts}/>
        <Input addContact={(name,phone,birth)=>this.addContact(name,phone,birth)}/>
        <footer className="App-footer">
        </footer>
      </div>
    );
  }
}

export default App;
