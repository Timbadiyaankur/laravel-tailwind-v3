import { createStore } from "vuex"

import axios from 'axios'
import * as Api from "../core/apis"
import * as Form from "../core/utils/form"
import { useToast } from 'vue-toastification'

const toast = useToast()

const initialState = {
    formErrors: {},
}

const initURL = '/contacts'

const store = createStore({
    namespaced: true,
    state: initialState,
    modules: {},
    mutations: {
        SET_FORM_ERRORS: (state, payload = {}) => {
            state.formErrors = payload
        },
        RESET_STATE: (state) => {
            state = initialState
        },
    },
    actions: {
        resetFormErrors({ commit }) {
            commit('SET_FORM_ERRORS')
        },
        list({ commit }, payload) {
            return Api.list(initURL)
            .then(response => {
                return response
            }).catch(error => {
                Form.getErrors(error)
                throw error
            })
        },
        async get({ commit }, payload) {
            try {
                return await Api.get(initURL, payload.id);
            } catch (error) {
                Form.getErrors(error)
                throw error
            }
        },
        async create({ commit }, payload) {
            await Api.store(initURL, payload.form)
            .then(response => {
                toast.success(response.message)
            }).catch(error => {
                commit('SET_FORM_ERRORS', Form.getErrors(error))
                throw error
            })
        },
        async update({ commit }, payload) {
            await Api.update(initURL, payload.id, payload.form)
            .then(response => {
                toast.success(response.message)
            }).catch(error => {
                commit('SET_FORM_ERRORS', Form.getErrors(error))
                throw error
            })
        },
        async delete({ commit }, payload) {
            await Api.destroy(initURL, payload.id)
            .then(response => {
                toast.success(response.message)
            }).catch(error => {
                Form.getErrors(error)
                throw error
            })
        },
    },
    getters: {
        getFormErrors: (state) => state.formErrors,
    }
})

export default store
