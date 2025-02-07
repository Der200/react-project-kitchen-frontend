import React, { useEffect, useState } from 'react';

import { Link, useHistory } from 'react-router-dom';
import ListErrors from '../../ListErrors/ListErrors';
import agent from '../../../agent';
import { connect, useSelector } from 'react-redux';
import Button from '../../Button/Button';

import styles from '../Auth.module.scss';
import Form from '../../Form/Form';
import { AUTHORIZATION } from '../../../slices/common-slice/common';

const mapStateToProps = (state) => ({ ...state.common });

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (email, password) => dispatch({ type: AUTHORIZATION, payload: agent.Auth.login(email, password) }),
});

const Login = (props) => {
  const currentUser = useSelector((state) => state.common.currentUser);
  const history = useHistory();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const errors = useSelector((state) => state.common.errors);
  const [sendStatus, setSendStatus] = useState(false);

  useEffect(() => {
    if (currentUser) {
      history.replace('/');
      setSendStatus(false);
    }
  }, [history, currentUser]);

  const submitForm = (email, password) => (ev) => {
    ev.preventDefault();
    props.onSubmit(email, password);
    setSendStatus(true);
  };

  const changeDataHandler = (ev) => {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Войти</h1>
      <p className={styles.option}>
        <Link to="/register">Хотите создать аккаунт?</Link>
      </p>

      {sendStatus && errors !== null && <ListErrors errors={props.errors} />}

      <Form onSubmit={submitForm(formData.email, formData.password)}>
        <input
          type="email"
          name="email"
          placeholder="default@gmail.com"
          value={formData.email || ''}
          onChange={changeDataHandler}
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password || ''}
          onChange={changeDataHandler}
        />
        <Button type="submit" disabled={props.inProgress}>
          Войти
        </Button>
      </Form>
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
