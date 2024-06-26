import React from "react";
import { useState } from "react";

import "../styles/App.css";

import TimelineController from "../components/TimelineController";
import InstrumentList from "../components/InstrumentList";
import InstrumentCreation from "../components/InstrumentCreation";

// Компонент главной страницы
const Main = () => {
    // Список синтезаторов по умолчанию
    const defaultSynthList = [
        {
            'name': 'sine',
            'oscillator': { 'type': 'sine' },
            'color': '#00bfbf'
        },
        {
            'name': 'square',
            'oscillator': { 'type': 'square' },
            'color': '#eb7734'
        },
        {
            'name': 'sawtooth',
            'oscillator': { 'type': 'sawtooth' },
            'color': '#eb348f'
        }
    ]

    // Опции музыки
    const [activeSynth, setActiveSynth] = useState(defaultSynthList[0]); // Состояние, определяющее используемый на данный момент синтезатор
    const [synthList, setSynthList] = useState(defaultSynthList); // Состояние, определяющее список доступных пользователю синтезаторов

    return (
        <main className="main">
            <TimelineController activeSynth={activeSynth} />
            <div className="synth-options">
                <div className="instruments">
                    <h2>Инструменты</h2>
                    <InstrumentList setActiveSynth={setActiveSynth} synthList={synthList} />
                </div>
                <div className="synth-creation">
                    <h2>Создание синтезатора</h2>
                    <InstrumentCreation synthList={synthList} setSynthList={setSynthList} />
                </div>
                <div className="saved-songs">
                    <h2>Сохраненные песни</h2>
                </div>
            </div>
        </main>
    )
}

export default Main;