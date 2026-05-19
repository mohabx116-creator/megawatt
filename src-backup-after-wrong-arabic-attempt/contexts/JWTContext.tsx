// import React, { createContext, useEffect, useReducer } from 'react';

// // third party
// import { Chance } from 'chance';
// import { jwtDecode } from 'jwt-decode';

// // reducer - state management
// import { LOGIN, LOGOUT } from 'store/actions';
// import accountReducer from 'store/accountReducer';

// // project imports
// import Loader from 'ui-component/Loader';
// import axios from 'utils/axios';

// // types
// import { KeyedObject } from 'types';
// import { InitialLoginContextProps, JWTContextType } from 'types/auth';
// import { Axios } from 'axios';

// import  AxiosTest  from 'axios';

// const chance = new Chance();

// // constant
// const initialState: InitialLoginContextProps = {
//   isLoggedIn: false,
//   isInitialized: false,
//   user: null
// };

// function verifyToken(serviceToken: string): boolean {
//   if (!serviceToken) {
//     return false;
//   }

//   const decoded: KeyedObject = jwtDecode(serviceToken);

//   // Ensure 'exp' exists and compare it to the current timestamp
//   if (!decoded.exp) {
//     throw new Error("Token does not contain 'exp' property.");
//   }

//   return decoded.exp > Date.now() / 1000;
// }

// function setSession(serviceToken?: string | null): void {
//   if (serviceToken) {
//     localStorage.setItem('serviceToken', serviceToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
//   } else {
//     localStorage.removeItem('serviceToken');
//     delete axios.defaults.headers.common.Authorization;
//   }
// }

// // ==============================|| JWT CONTEXT & PROVIDER ||============================== //

// const JWTContext = createContext<JWTContextType | null>(null);

// export function JWTProvider({ children }: { children: React.ReactElement }) {
//   const [state, dispatch] = useReducer(accountReducer, initialState);

//   useEffect(() => {
//     // const init = async () => {
//     //   try {
//     //     const serviceToken = window.localStorage.getItem('serviceToken');
//     //     if (serviceToken && verifyToken(serviceToken)) {
//     //       setSession(serviceToken);
//     //       // const response = await axios.get('/api/account/me');
       
//     //       const response = await AxiosTest.get('https://mock-data-api-nextjs.vercel.app/api/account/me');
//     //       const { user } = response.data;
//     //       dispatch({
//     //         type: LOGIN,
//     //         payload: {
//     //           isLoggedIn: true,
//     //           user
//     //         }
//     //       });
//     //     } else {
//     //       dispatch({
//     //         type: LOGOUT
//     //       });
//     //     }
//     //   } catch (err) {
//     //     console.error(err);
//     //     dispatch({
//     //       type: LOGOUT
//     //     });
//     //   }
//     // };

//     const init = async () => {
//       try {
//         // Option A: disable Berry mock auth initialization.
//         // Do not call /api/account/me (mock or backend) until you wire real auth.
    
//         // Optional: clear any previous token to avoid side effects
//         // window.localStorage.removeItem('serviceToken');
//         // setSession(null);
    
//         dispatch({
//           type: LOGOUT
//         });
//       } catch (err) {
//         console.error(err);
//         dispatch({
//           type: LOGOUT
//         });
//       }
//     };
    

//     init();
//   }, []);

//   const login = async (email: string, password: string) => {
//     const response = await AxiosTest.post('https://mock-data-api-nextjs.vercel.app/api/account/login', { email, password });
//     const { serviceToken, user } = response.data;
//     setSession(serviceToken);
//     dispatch({
//       type: LOGIN,
//       payload: {
//         isLoggedIn: true,
//         user
//       }
//     });
//   };

//   const register = async (email: string, password: string, firstName: string, lastName: string) => {
//     // todo: this flow need to be recode as it not verified
//     const id = chance.bb_pin();
//     const response = await axios.post('https://mock-data-api-nextjs.vercel.app/api/account/register', {
//       id,
//       email,
//       password,
//       firstName,
//       lastName
//     });
//     let users = response.data;

//     if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
//       const localUsers = window.localStorage.getItem('users');
//       users = [
//         ...JSON.parse(localUsers!),
//         {
//           id,
//           email,
//           password,
//           name: `${firstName} ${lastName}`
//         }
//       ];
//     }

//     window.localStorage.setItem('users', JSON.stringify(users));
//   };

//   const logout = () => {
//     setSession(null);
//     dispatch({ type: LOGOUT });
//   };

//   const resetPassword = async (email: string) => {};

//   const updateProfile = () => {};

//   if (state.isInitialized !== undefined && !state.isInitialized) {
//     return <Loader />;
//   }

//   return <JWTContext value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext>;
// }

// export default JWTContext;




//******************** NO AUTHORIZATION************ */


import React, { createContext, useEffect, useReducer } from 'react';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

// types
import { InitialLoginContextProps, JWTContextType } from 'types/auth';

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const initialState: InitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

function setSession(serviceToken?: string | null): void {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
}

const JWTContext = createContext<JWTContextType | null>(null);

export function JWTProvider({ children }: { children: React.ReactElement }) {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    // Option A: Disable Berry mock auth initialization (no HTTP calls).
    // This prevents requests to mock-data-api-nextjs.vercel.app and avoids 401 spam.
    setSession(null);

    dispatch({
      type: LOGOUT
      // accountReducer in Berry typically sets: isLoggedIn=false, user=null, isInitialized=true
    });
  }, []);

  // Option A: auth is disabled for now (until you wire your backend auth).
  const login = async (email: string, password: string) => {
    if (email === 'info@codedthemes.com' && password === '123456') {
      const dummyToken = 'dummy-jwt-token';
      const user = {
        id: '1',
        email: 'info@codedthemes.com',
        name: 'Demo User'
      };
      setSession(dummyToken);
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const register = async (_email: string, _password: string, _firstName: string, _lastName: string) => {
    throw new Error('Auth is disabled (Option A). Wire backend auth to enable register.');
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (_email: string) => {
    throw new Error('Auth is disabled (Option A).');
  };

  const updateProfile = () => {
    throw new Error('Auth is disabled (Option A).');
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>
      {children}
    </JWTContext.Provider>
  );
}

export default JWTContext;
