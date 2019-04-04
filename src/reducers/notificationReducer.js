
const initialNotification = {
    text: null,
    look: null,
}
let notifTimeout

const notificationReducer = (store = initialNotification, action) => {

    switch (action.type) {
        case 'SHOWNOTIF':
            return { text: action.text, look: action.look }

        case 'KM_QUERY_STARTED':
            return { text: 'Loading distances...' }

        case 'MIN_QUERY_STARTED':
            return { text: 'Loading travel times...' }

        case 'UPDATE_MIN_TARGETS':
        case 'UPDATE_KM_TARGETS':
            return { text: null }

        case 'RMNOTIF':
            return initialNotification

        default:
            return store
    }
}

export const showNotification = (text, look, notiftime) => {
    return async (dispatch) => {
        dispatch(rmNotification())
        await new Promise(resolve => notifTimeout = setTimeout(resolve, 120))
        dispatch({ type: 'SHOWNOTIF', text, look })
        clearTimeout(notifTimeout)
        await new Promise(resolve => notifTimeout = setTimeout(resolve, notiftime * 1000))
        dispatch(rmNotification())
    }
}

export const rmNotification = () => {
    clearTimeout(notifTimeout)
    return ({ type: 'RMNOTIF' })
}

export default notificationReducer
