import Cookies from 'js-cookie';

const cookieName = 'buscalClient';



const getGuestUser = () => {
    return { firstname: null, lastname: null, role: {} };
}

const setUser = user => {
    Cookies.set(cookieName, user);
}
const getUser = () => {
    if (Cookies.get(cookieName)) {
        return Cookies.get(cookieName)
    } else {
        return null
    }
}

const logout = () => {
    // window.history.replaceState(null, null, "/");
    Cookies.remove(cookieName);
    // this.props.history.push('/salesman/');
}

export {
    getGuestUser,
    setUser,
    getUser,
    logout
};