import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

import { useFetching } from "../useFetching";
import UserService from "../UserService";
import Loader from "./Loader";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

// Компонент авторизации
const LoginController = () => {
    const {user, setUser} = useContext(AuthContext); // Подтягиваем состояние из контекста
    const navigate = useNavigate(); // Функция редиректа

    // ОБращение к стороннему апи логаута через сервис с помощью обертки
    const [fetchLogout, isLogoutLoading, logoutError] = useFetching(async () => {
        await UserService.Logout(user.token);
        setUser(null);
        //console.log(user);
    })
    
    // Функция нажатия на кнопку логаута
    const Logout = async (event) => {
        event.preventDefault();
        fetchLogout();
        navigate(`/`, {replace: false});
    }

    // Функция навигации к странице профиля пользователя
    const transitToProfile = (uid) => {
        navigate(`/users/${uid}`, {replace: false})
    }

    // Представление компонента для авторизованного пользователя
    const authorized_view = (
        <>
            {logoutError && <div className="logout_error">{logoutError}!</div>}

            {isLogoutLoading
            ?
            <div className="loader_block"><Loader /></div>
            :
            <div className="logout_block">
                <div onClick={() => transitToProfile(user.uid)} className="profile_block">
                    Профиль
                </div>
                <button onClick={Logout} className="login_button">
                    Выйти
                </button>
            </div>
            }
        </>
    );

    // Представление компонента для неавторизованного пользователя
    const no_authorized_view = (
        <>
            <RegistrationForm />
            <LoginForm />
        </>
    );

    return (
        user
        ?
        authorized_view
        :
        no_authorized_view
    )
}

export default LoginController;