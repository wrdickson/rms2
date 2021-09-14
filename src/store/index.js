import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  //  the docs say to set strict to FALSE for PRODUCTION
  //  https://vuex.vuejs.org/guide/strict.html
  //  true is good for warning you when you're messing with the data flow
  strict: true,
  state: {
    account: {},
    currentSpaceOpenClose: [],
    jwt: '',
    reservations: [],
    resViewStart: moment().format('YYYY-MM-DD'),
    resViewEnd: moment().add(32, 'day').format('YYYY-MM-DD'),
    rootSpaces: null,
    selectedFolio: {
      id: '999',
      sales: [],
      payments: [],
      customer: '0',
      reservation: '0'
    },
    selectGroups: {},
    selectedReservation: {
      id: '0',
      checkin: '2015-01-01',
      checkout: '2015-01-02',
      customer: '0',
      customer_obj: {},
      people: '0',
      beds: '0',
      folio: '0',
      folio_obj: {},
      history: [],
      notes: [],
      space_code: '0',
      space_id: '0',
      space_type: '0',
      status: '0'
    },
    selectedReservationId: '0',
    spaces: [],
    spaceTypes: {},
    tapeChartGridShowState: null,
    tapeChartScrollPosition: { x: 0, y: 0 }
  },
  mutations: {
    setAccount (state, account) {
      state.account = account
      localStorage.setItem('account', JSON.stringify(account))
    },
    setAccountToGuest (state) {
      state.account = {
        id: '0',
        username: 'Guest',
        permission: '0',
        roles: []
      }
      localStorage.setItem('account', JSON.stringify(state.account))
    },
    setJwt (state, jwt) {
      state.jwt = jwt
      localStorage.setItem('jwt', jwt)
    },
    setReservations (state, reservations) {
      state.reservations = reservations
    },
    setResViewEnd (state, resViewEnd) {
      state.resViewEnd = resViewEnd
    },
    setResViewStart (state, resViewStart) {
      state.resViewStart = resViewStart
    },
    setRootSpaces (state, rootSpaces) {
      state.rootSpaces = rootSpaces
    },
    setSelectGroups (state, selectGroups) {
      state.selectGroups = selectGroups
    },
    setSpaces (state, spaces) {
      state.spaces = spaces
    },
    setSpaceTypes (state, spaceTypes) {
      state.spaceTypes = spaceTypes
    },
    setTapeChartGridShowState (state, showState) {
      state.tapeChartGridShowState = showState
    },
    // @param position: object with x and y coordinates
    setTapeChartScrollPosition (state, position) {
      state.tapeChartScrollPosition = position
    }

  },
  actions: {
  },
  modules: {
  }
})
