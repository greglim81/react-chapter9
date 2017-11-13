import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Table, Button, Glyphicon, Modal } from 'react-bootstrap';         
import { Link } from 'react-router-dom'; 

class User extends Component {

  constructor(props){
    super(props);        
    this.state = {
        users: [],
        showDeleteDialog: false,
        selectedUser: {}              
    };   
    this.add = this.add.bind(this); 
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);                                       
    this.delete = this.delete.bind(this);        
  }  

  componentDidMount(){
    firebase.database().ref('/')
      .on('value',snapshot => {
        let returnArr = [];        
        snapshot.forEach(data => {
            var user = data.val();
            user['key'] = data.key;
            returnArr.push(user);        
        });                       
        this.setState({
            users: returnArr
        })                
      });           
  } 

  add(e) {
    this.props.history.push("/add");  
  }   
  
  openDeleteDialog(user){    
    this.setState({        
        showDeleteDialog: true,
        selectedUser: user
    });   
  }  

  closeDeleteDialog() {
    this.setState({ 
        showDeleteDialog: false,
        selectedUser: {}
    });
  }  

  delete(e) {    
    firebase.database().ref('/'+this.state.selectedUser.key).remove()
    .then( x=> {
        console.log("SUCCESS");
        this.closeDeleteDialog();
    })
    .catch( error => {
        alert("Could not delete the user.");
        console.log("ERROR", error)
    });
  }       

  render() {
    const listUsers = this.state.users.map((user) =>   
    <tr key={user.key}>
      <td>{user.username}</td>
      <td>{user.email}</td>      
      <td>
          <Link to={`/edit/${user.key}`}>            
              <Glyphicon glyph="edit"/>
          </Link>        
          </td>        
      <td><Glyphicon glyph="remove" onClick={this.openDeleteDialog.bind(this,user)}/></td>          
    </tr>                    
    ); 

    return (
      <div>  
        <Button bsStyle="primary" onClick={this.add}>Add</Button>        
        <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {listUsers}
        </tbody>
        </Table>
        <Modal show={this.state.showDeleteDialog} onHide={this.closeDeleteDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>            
            <p>Are you sure you want to delete {this.state.selectedUser.username}?</p>
            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.delete}>Delete</Button>
            <Button onClick={this.closeDeleteDialog}>Close</Button>
          </Modal.Footer>
        </Modal>                          
      </div>
    );
  }
}

export default User;

