import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { db } from '../firebase/firebase';

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    user: null,
    status: null,
    error: null

  },
  mutations: {

    setUser (state, payload) {
      state.user = payload
    },

    removeUser (state) {
      state.user = null
    },

    setStatus (state, payload) {
      state.status = payload
    },

    setError (state, payload) {
      state.error = payload
    }

  },
  actions: {
    signUpAction ({ commit }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit('setUser', response.user.uid)
          commit('setStatus', 'success')
          commit('setError', null)
          payload.self.$router.push({name: payload.link});
        })
        .catch((error) => {
          commit('setStatus', 'failure')
          commit('setError', error.message)
        })
    },

    signInAction ({ commit }, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          localStorage.setItem('user', response.user.uid);
          commit('setUser', response.user.uid)
          commit('setStatus', 'success')
          commit('setError', null)
          payload.self.$router.push({name: payload.link});
        })
        .catch((error) => {
          commit('setStatus', 'failure')
          commit('setError', error.message)
        })
    },

    signOutAction ({ commit } ,payload) {
      firebase.auth().signOut()
        .then((response) => {
          commit('setUser', null)
          commit('setStatus', 'success')
          commit('setError', null)
          localStorage.removeItem('user');
          
          payload.$router.push({name: 'signin'})
        })
        .catch((error) => {
          commit('setStatus', 'failure')
          commit('setError', error.message)
        })
    },
  },

  getters: {
    status (state) {
      return state.status
    },



    user (state) {
      return state.user
    },

    error (state) {
      return state.error
    }
  }
})
