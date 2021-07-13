import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from '../Tags/Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED, APPLY_TAG_FILTER } from '../../constants/actionTypes';
// import {
//   HOME_PAGE_LOADED,
//   HOME_PAGE_UNLOADED,
// } from '../../slices/home';
// import {
//   HOME_PAGE_LOADED as HOME_ARTICLE_LOADED,
//   HOME_PAGE_UNLOADED as HOME_ARTICLE_UNLOADED,
//   APPLY_TAG_FILTER,
// } from '../../slices/articleList';
import styles from './home.module.scss';

const { content__container, content__tags, wrapper, tags__title } = styles;

const Promise = global.Promise;

const mapStateToProps = (state) => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  onClickTag: (tag, pager, payload) => dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab, pager, payload) => {
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload });
    // dispatch({ type: HOME_ARTICLE_LOADED, tab, pager, payload });
  },
  onUnload: () => {
    dispatch({ type: HOME_PAGE_UNLOADED });
    // dispatch({  type: HOME_ARTICLE_UNLOADED });
  },
});

class Home extends React.Component {
  UNSAFE_componentWillMount() {
    const tab = 'all';
    const articlesPromise = agent.Articles.all;

    this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise()]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <>
        <Banner token={this.props.token} appName={this.props.appName} />
        <main className={content__container}>
          <MainView currentUser={this.props.currentUser} />
          <div className={wrapper}>
            <section className={content__tags}>
              <p className={tags__title}>Популярные теги</p>
              {!this.props.tags && <div className={styles.loading}>Теги подгружаются...</div>}
              {this.props.tags && <Tags tags={this.props.tags} onClickTag={this.props.onClickTag} />}
            </section>
          </div>
        </main>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
