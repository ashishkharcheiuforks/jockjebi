import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        jockboList: [],
        searchSubject: '',

        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh'),
        nickname: localStorage.getItem('nickname'),
        useruni: localStorage.getItem('useruni'),

        endpoints: {
            obtainJWT: '/api/token',
            refreshJWT: '/api/token/refresh',
            inspectJWT: '/api/token/verify'
        },
    },
    mutations: {
        updateTokenAndUserData(state, data){
            localStorage.setItem('access', 'Bearer ' + data.access);
            localStorage.setItem('refresh', 'Bearer ' + data.refresh);
            localStorage.setItem('nickname', data.nickname);
            localStorage.setItem('useruni', data.university);

            state.access= 'Bearer ' + data.access
            state.refresh= 'Bearer ' + data.refresh
            state.nickname= data.nickname
            state.useruni= data.university
        },
        updateToken(state, access){
            localStorage.setItem('access', 'Bearer ' + access);
            state.access = 'Bearer ' + access
        },
        removeToken(state){
            localStorage.removeItem('useruni');
            localStorage.removeItem('nickname');
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');

            state.access = ''
            state.refresh = ''
            state.nickname = ''
            state.useruni = ''
        },
    },
    actions: {
        obtainToken(context, payload){
            //return을 해야 받은쪽에서 에러 처리를 할수 있다.
            return axios.post(this.state.endpoints.obtainJWT, payload)
                .then(response =>{
                    this.commit('updateTokenAndUserData', response.data);
                }).catch((error)=>{
                    throw error
                })
        },
        refreshToken(context){
            return axios.post(this.state.endpoints.refreshJWT, {refresh: this.state.refresh.substring(7)})
                .then((response)=>{
                    this.commit('updateToken', response.data.access)
                })
                .catch((error)=>{
                    throw error
                })
        },
        inspectTokenRequest(context){
            return axios.post(this.state.endpoints.inspectJWT, {token: this.state.access.substring(7)})
        },
        async inspectToken(context) {
            if(context.state.access) {
                try {
                    await context.dispatch('inspectTokenRequest')
                } catch (error) {
                    try {
                        await context.dispatch('refreshToken')
                    }
                    catch (error) {
                        context.commit('removeToken')
                        throw '다시 로그인해주세요 호호'
                    }
                }
            }
        }
    }
})


