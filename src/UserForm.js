import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as firebase from 'firebase';

class UserForm extends Component {
  constructor(props){
    super(props);  
  }
  
  render(){
    return(
      <div>
          <h1>Any place in your app!</h1>
          <Formik
            initialValues={{ username: '', email: '' }}
            validate={values => {
              let errors = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
              else if (values.email.length < 10) {
                errors.email = 'Email address too short';
              } 
              
              if (!values.username) {
                errors.username = 'Required';
              }
              else if (values.username.length < 3) {
                errors.username = 'username too short';
              }  

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                // actual submit logic...         
                firebase.database().ref('/').push({
                    username: this.state.username,	
                    email: this.state.email  
                }).then(() => this.props.history.push("/"));                                  
                
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field type="email" name="email" />
                <span style={{ color:"red", fontWeight: "bold" }}>
                  <ErrorMessage name="email" component="div" />
                </span>                               
                <Field type="password" name="password" />
                <span style={{ color:"red", fontWeight: "bold" }}>
                  <ErrorMessage name="password" component="div" />
                </span>                
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>      
    )    
  }
}

export default UserForm;
