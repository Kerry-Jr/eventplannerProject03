import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Header, Form, Segment, Message, List, Pagination, Button, Image, Container, Grid, Icon} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import axios from 'axios';

import requireAuth from './../../hoc/requireAuth';

import { getUserTodos, updateCompleteUserTodoById, deleteTodoById } from '../../actions/allTodos';
import { ADD_USER_TODO, ADD_USER_TODO_ERROR } from '../../actions/types';


// import { ADD_USER_EVENT } from '../../actions/types'
import { getUserEvents, deleteUserEvent, selectEvent } from '../../actions/eventActions'

import UserTodoListItems from './UserTodoListItems';

import './list.css';

import HorizontalDivider from './../../components/HorizontalDivider';


class UserTodoList extends Component {
  state = {
    activePage: 1,
    start: 0,
    end: 10,
  }


  componentDidMount() {
    this.props.getUserEvents();
  }

  onSubmit = async (formValues, dispatch) => {
    try {
      await axios.post('/api/user/todos', formValues, { headers: { 'authorization': localStorage.getItem('token')}});
      dispatch({ type: ADD_USER_TODO });
      this.props.getUserTodos();
    } catch (e) {
      dispatch({ type: ADD_USER_TODO_ERROR, payload: 'You must provide text' });
    }
  }

  renderAddTodo = ({ input, meta })=> {
    return (
      <Form.Input
        {...input}
        error={ meta.touched && meta.error }
        autoComplete='off'
        placeholder='Event Name'
      />
    );
  }

  handleRedirect = (_id, completed) => {
    this.props.selectEvent(_id, completed)
    this.props.history.push('/eventsdashboard')
  }

  handlePageChange = (event, data) => {
    this.setState({
      activePage: data.activePage,
      start: data.activePage === 1 ? 0 : data.activePage * 10 - 10,
      end: data.activePage * 10
    });
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <>
        
        <Header as='h2' icon textAlign='center'>
          <Icon name='calendar alternate outline' circular size='massive'/>
          <HorizontalDivider title="My Events"/>
        </Header>

        <Form size='large' onSubmit={handleSubmit(this.onSubmit)}>
          {/* ======= DELETE THIS ======== */}
          {/* <Segment stacked>
            <Field
              name='text'
              component={this.renderAddTodo}
            />
            <Button
              type='submit'
              fluid
              color='teal'
              content='Create new event'/>
          </Segment> */}
        </Form>

        <Container>
          
              <List divided selection className='list'>
                <UserTodoListItems
                  events={this.props.userEvents.slice(this.state.start, this.state.end)}
                  handleDelete={this.props.deleteUserEvent}
                  handleEventSelect={this.props.selectEvent}
                  handleRedirect={this.handleRedirect}
                />
              </List>
           <Container className='page-nation'>
              { this.props.userEvents.length === 0 ?
              null
              : <Pagination
                totalPages={ Math.ceil(this.props.userEvents.length / 10) }
                activePage={this.state.activePage}
                onPageChange={ (e, data) => this.handlePageChange(e, data) }
              />

              }

           </Container>
        </Container>
        

        
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    userTodos: state.todos.userTodos,
    todoClientError: state.todos.getUserTodosClientError,
    todoServerError: state.todos.getUserTodosServerError,
    userEvents: state.event.userEvents,
    specificEvent: state.event.specificEvent,
    specificEventError: state.event.specificEventError,
    deleteEventError: state.event.deleteEventError,
  };
};


// export default reduxForm({ form: 'addTodo' })(connect(mapStateToProps, { getUserTodos })(UserTodoList));
// export default connect(mapStateToProps, { getUserTodos })(reduxForm({ form: 'addTodo' })(UserTodoList))

// const composedComponent = connect(mapStateToProps, { getUserTodos })(UserTodoList);
// export default reduxForm({ form: 'addTodo' })(composedComponent);

const composedComponent =  compose(
  reduxForm({ form: 'addTodo' }),
  connect(mapStateToProps, { getUserEvents, selectEvent, deleteUserEvent, getUserTodos, updateCompleteUserTodoById, deleteTodoById })
)(UserTodoList);


export default requireAuth(composedComponent);
