import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ListErrors from '../../ListErrors/ListErrors';
import agent from '../../../agent';
import { connect, useSelector } from 'react-redux';
import { AUTHORIZATION } from '../../../slices/common-slice/common';
import Button from '../../Button/Button';

import styles from '../Auth.module.scss';
import Form from '../../Form/Form';

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, email, password) => {
    const payload = agent.Auth.register(username, email, password);
    dispatch({ type: AUTHORIZATION, payload });
  },
});

const Register = (props) => {
  const currentUser = useSelector((state) => state.common.currentUser);
  const errors = useSelector((state) => state.common.errors);
  const [sendStatus, setSendStatus] = useState(false);

  const history = useHistory();

  const submitForm = (username, email, password) => (ev) => {
    ev.preventDefault();
    props.onSubmit(username, email, password);
    setSendStatus(true);
  };

  useEffect(() => {
    if (currentUser) {
      history.replace('/');
      setSendStatus(false);
    }
  }, [currentUser, history]);

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const changeDataHandler = (ev) => {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Зарегистрироваться</h1>
      <p className={styles.option}>
        <Link to="/login">Уже есть аккаунт?</Link>
      </p>

      {sendStatus && errors !== null && <ListErrors errors={errors} />}

      <Form onSubmit={submitForm(formData.username, formData.email, formData.password)}>
        <input
          type="text"
          name="username"
          placeholder="Никнейм"
          value={formData.username || ''}
          onChange={changeDataHandler}
          required
          maxLength={15}
        />

        <input
          type="email"
          name="email"
          placeholder="default@gmail.com"
          value={formData.email || ''}
          onChange={changeDataHandler}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password || ''}
          onChange={changeDataHandler}
          required
        />

        <Button type="submit" disabled={props.inProgress}>
          Зарегистрироваться
        </Button>
      </Form>
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
