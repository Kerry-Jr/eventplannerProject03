import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Segment, Button, Icon, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
// import { compose } from 'redux';
import { length, required} from 'redux-form-validators';
import axios from 'axios';
import requireAuth from './../../hoc/requireAuth';
import DatePicker from 'react-datepicker';
import './createevent.css'
import { compose } from 'redux';
import "react-datepicker/dist/react-datepicker.css";
// import { getUserTodos, updateCompleteUserTodoById, deleteTodoById } from '../../actions/allTodos';
import { getUserEvents } from '../../actions/eventActions'
// import { getUserTodos, updateCompleteUserTodoById, deleteTodoById } from '../../actions/allTodos';
import { ADD_USER_EVENT } from '../../actions/types'
import { AUTH_USER, ADD_USER_TODO, ADD_USER_TODO_ERROR } from '../../actions/types';
// import UserTodoListItems from './UserTodoListItems';


class CreateEvent extends Component {

  state = {
    startDate: ''
  };
  handleSelect = date => {
    this.setState({      startDate: date    });
  };
  renderDatePicker = ({input, placeholder, defaultValue, meta: {touched, error} }) => (
    <div className='customDatePickerWidth'>
      <Form.Input error={ touched && error }>
      <DatePicker className='dateForm' {...input} dateForm="MM/DD/YYYY" selected={this.state.startDate} onSelect={this.handleSelect} />
      {/*{touched && error && <span>{error}</span>}*/}
      </Form.Input>
     </div>
  );

  componentDidMount() {
    this.setState({startDate: new Date() })
  }

  onSubmit = async (formValues, dispatch) => {
    console.log(formValues);
    try {
      const { data } = await axios.post('/api/event/create', formValues,  { headers: { 'authorization': localStorage.getItem('token')}});
      dispatch({ type: ADD_USER_EVENT })
      this.props.getUserEvents();
      this.props.history.push('/eventsdashboard');
    } catch (e) {
      throw new SubmissionError({
        password: 'Wrong pin',
        _error: 'No event to join!'
      });
    }
  }

  renderInput = ({ input, meta }) => {
    return (
      <Form.Input
        {...input}
        fluid
        error={ meta.touched && meta.error }
        icon='file'
        iconPosition='left'
        autoComplete='off'
        placeholder='Do not leave blank'
      />
    )
  }

  renderPassword = ({ input, meta }) => {
    return (
      <Form.Input
        {...input}
        type='text'
        fluid
        error={ meta.touched && meta.error }
        icon='key'
        iconPosition='left'
        autoComplete='off'
        placeholder='PIN'
      />
    )
  }

  render() {
    const { handleSubmit, invalid, submitting, submitFailed, pristine, reset } = this.props;
    return (
      <Container fluid className='body'>
        <Container className='formFields'>
        <Form size='large' onSubmit={handleSubmit(this.onSubmit)}>
          <Segment>
            <h2 className='form-headers' align='left'>Name of event</h2>
            <Field
              
              name='title'
              validate={
                [
                  required({ msg: 'Please name your event!' })
                ]
              }
              component={this.renderInput}
            />
            <h3 className='form-headers' align='left'>Date of the event</h3>
            <Field
              name='date'
              validate={
                [
                  required({ msg: 'Date of event required' })
                ]
                      }
              component={this.renderDatePicker}
            />
            <h3 className='form-headers' align='left' >Describe the event for your guests.</h3>
            <Field
            
              className='text-area'
              name='description'
              validate={
                     [
                       required({ msg: 'Description is required' })
                     ]
                   }
              component={this.renderInput}
              className='field'
            />
            <h3 className='form-headers' align='left'>4-Digit access code</h3>
            <p>This will be used for inviting guest who can update the event.</p>
            <Field
              name='pin'
              label='password'
              validate={
                [
                  required({ msg: '4-digit pin is required' }),
                  length({ minimum: 4, maximum: 4, msg: 'example: 0000'})
                ]
              }
              component={this.renderPassword}
            />
            <Button
              animated
              type='submit'
              size='large'
              color='facebook'
              disabled={ invalid || submitting || submitFailed }
            >
              <Button.Content visible>Create Event</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
            <Button
              animated
              type='button'
              size='large'
              color='red'
              disabled={ invalid || submitting || submitFailed }
            >
              <Button.Content visible>Reset Event</Button.Content>
              <Button.Content hidden>
                <Icon name='long arrow alternate left' />
              </Button.Content>
            </Button>
          </Segment>
        </Form>
        </Container>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    userEvents: state.event.userEvents,
  }
}

const composedComponent = compose(
  reduxForm({ form: 'CreateEvent'}),
  connect(mapStateToProps, { getUserEvents })
)(CreateEvent)

export default requireAuth(composedComponent)