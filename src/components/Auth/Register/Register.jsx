import React, { FC } from 'react';

import { Link } from 'react-router-dom';
import ListErrors from '../../ListErrors/ListErrors';
import agent from '../../../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  REGISTER,
  REGISTER_PAGE_UNLOADED
} from '../../../constants/actionTypes';
import Button from "../../Button/Button";

import styles from '../Auth.module.scss';
import clsx from 'clsx';
import Form from '../../Form/Form';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onChangeUsername: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
  onSubmit: (username, email, password) => {
    const payload = agent.Auth.register(username, email, password);
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () =>
    dispatch({ type: REGISTER_PAGE_UNLOADED })
});

class Register extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
    this.submitForm = (username, email, password) => ev => {
      ev.preventDefault();
      this.props.onSubmit(username, email, password);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    const username = this.props.username;

    return (
      <section className={styles.container}>
        <h1 className={styles.title}>Зарегистрироваться</h1>
        <p className={styles.option}>
          <Link to="/login">
            Уже есть аккаунт?
          </Link>
        </p>

        <ListErrors errors={this.props.errors} />

        <Form onSubmit={this.submitForm(username, email, password)}>
          <input
            type="text"
            placeholder="Никнейм"
            value={this.props.username}
            onChange={this.changeUsername} 
            required
            maxLength={15}
          />

          <input
            type="email"
            placeholder="default@gmail.com"
            value={this.props.email}
            onChange={this.changeEmail} 
            required
          />

          <input
            type="password"
            placeholder="Пароль"
            value={this.props.password}
            onChange={this.changePassword} 
            required
          />

          <Button
            type="submit"
            disabled={this.props.inProgress}
          >
            Зарегистрироваться
          </Button>
        </Form>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
