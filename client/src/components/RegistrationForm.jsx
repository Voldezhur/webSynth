import React, { useState } from "react";

import { useFetching } from "../useFetching";
import UserService from "../UserService";
import Loader from "./Loader";

// Компонент формы регистрации
const RegistrationForm = () => {
    // Состояния формы регистрации
    const [regFormStep, setRegFormStep] = useState(0);
    const [regFormData, setRegFormData] = useState({login: '', password: '', email: '', name: ''});


    // Обращение к стороннему апи регистрации через сервис с помощью обертки
    const [fetchRegister, isRegisterLoading, registerError] = useFetching(async () => {
        await UserService.Register(regFormData.login, regFormData.password, regFormData.email, regFormData.name);
    })

    // Функция отправки формы регистрации
    const Register = async (event) => {
        event.preventDefault();
        if (regFormStep == 1) {
            fetchRegister();
            setRegFormData({login: '', password: '', email: '', name: ''});
        }
        else {
            setRegFormStep(1);
        }
    }

    return (
        <div className="login_block">
            <form onSubmit={Register}>
                {regFormStep === 0
                ? 
                    (
                        <button className="login_button" type="submit">
                            Регистрация
                        </button>
                    )
                :
                    (
                        <>
                            {registerError && <div className="login_error">{registerError}!</div>}
                            
                            {isRegisterLoading
                            ?
                            <div className="loader_block"><Loader /></div>
                            :
                            <>
                                <label>
                                    Создание аккаунта webSynth
                                </label>
                                <input
                                    value={regFormData.name}
                                    onChange={e => setRegFormData({...regFormData, name: e.target.value})}
                                    required={true}
                                    type="text"
                                    placeholder="Введите имя пользователя"
                                    className="login_input"
                                />
                                <input
                                    value={regFormData.login}
                                    onChange={e => setRegFormData({...regFormData, login: e.target.value})}
                                    required={true}
                                    type="text"
                                    placeholder="Введите логин"
                                    className="login_input"
                                />
                                <input
                                    value={regFormData.email}
                                    onChange={e => setRegFormData({...regFormData, email: e.target.value})}
                                    required={true}
                                    type="text"
                                    placeholder="Введите email"
                                    className="login_input"
                                />
                                <input
                                    value={regFormData.password}
                                    onChange={e => setRegFormData({...regFormData, password: e.target.value})}
                                    required={true}
                                    type="password"
                                    placeholder="Введите пароль"
                                    className="login_input"
                                />
                                <button className="login_button" type="submit">
                                    Создать аккаунт
                                </button>
                            </>
                            }
                        </>
                    )}
            </form>
        </div>
    )
}

export default RegistrationForm;