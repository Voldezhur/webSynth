import React, { useState, useContext } from "react";

import { AuthContext } from "../AuthContext";
import { useFetching } from "../useFetching";
import UserService from "../UserService";
import Loader from "./Loader";

// Компонент формы авторизации
const LoginForm = () => {
    const {setUser} = useContext(AuthContext); // Подтягиваем состояние из контекста
    // Состояния формы авторизации
    const [logFormStep, setLogFormStep] = useState(0);
    const [logFormData, setLogFormData] = useState({login: '', password: ''});

    // Обращение к стороннему апи логина через сервис с помощью обертки
    const [fetchUser, isLoginLoading, loginError] = useFetching(async () => {
        const response = await UserService.Login(logFormData.login, logFormData.password);
        setUser(response.user);
        //console.log(response);
    })

    // Функция отправки формы
    const Login = async (event) => {
        event.preventDefault();
        if (logFormStep == 1) {
            fetchUser();
            setLogFormData({login: '', password: ''});
        }
        else {
            setLogFormStep(1);
        }
    };

    return (
        <div className="login_block">
            <form onSubmit={Login}>
                {logFormStep === 0
                ? 
                    (
                        <button className="login_button" type="submit">
                            Авторизация
                        </button>
                    )
                :
                    (
                        <>
                            {loginError && <div className="login_error">{loginError}!</div>}
                            
                            {isLoginLoading
                            ?
                            <div className="loader_block"><Loader /></div>
                            :
                            <>
                                <label>
                                    Вход в аккаунт webSynth
                                </label>
                                <input
                                    value={logFormData.login}
                                    onChange={e => setLogFormData({...logFormData, login: e.target.value})}
                                    required={true}
                                    type="text"
                                    placeholder="Введите логин"
                                    className="login_input"
                                />
                                <input
                                    value={logFormData.password}
                                    onChange={e => setLogFormData({...logFormData, password: e.target.value})}
                                    required={true}
                                    type="password"
                                    placeholder="Введите пароль"
                                    className="login_input"
                                />
                                <button className="login_button" type="submit">
                                    Войти
                                </button>
                            </>
                            }
                        </>
                    )}
            </form>
        </div>
    )
}

export default LoginForm;