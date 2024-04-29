import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import Slider from '@mui/material/Slider';

import * as Tone from 'tone';

const InstrumentCreation = ({ synthList, setSynthList }) => {
    const [synthName, setSynthName] = useState(''); // Состояние названия нового синтезатора
    const [synthType, setSynthType] = useState('sine'); // Состояния вида осциллятора нового синтезатора
    const [synthColor, setSynthColor] = useState('#fff'); // Состояние цвета нового синтезатора
    
    // Функция по сохранению нового синтезатора
    const handleSubmit = (event) => {
        event.preventDefault();
        
        const newSynth = {
            'name': synthName,
            'oscillator': { 'type': event.target['synthType'].value },
            'color': synthColor
        };

        setSynthList([...synthList, newSynth]);
    }
    
    // Функция по однократному проигрыванию звука для тестирования нового синтезатора
    const testSound = () => {
        const newSynth = {
            'name': synthName,
            'oscillator': { 'type': synthType },
            'color': synthColor
        };

        const synth = new Tone.Synth();
        synth.set(newSynth);
        synth.toDestination();

        synth.triggerAttackRelease('B3', "64n");
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="synth-creation-form">
                <button className="controlButton" type="button" onClick={testSound}>Протестировать звук</button>

                <button className="controlButton">Сохранить синтезатор</button>

                <div className="synth-options">
                    <div className="synth-meta">
                        <label>
                            Имя синтезатора:
                            <input type='text' name='synthName' onChange={(e) => {setSynthName(e.target.value)}} />
                        </label>
                        
                        <label>
                            Вид синтезатора:
                            <input type='text' name='synthType' onChange={(e) => {setSynthType(e.target.value)}} />
                        </label>
                        
                        <label className="synth-color">
                            <div className="synth-color-selection">
                                <p>Цвет ноты:</p>
                                <div style={{backgroundColor: synthColor}} className="synth-color-preview" />
                            </div>
                                <HexColorPicker color={synthColor} onChange={setSynthColor} />
                        </label>
                    </div>
                    
                    <div>
                        <label>
                            Слайдер
                            <Slider />
                        </label>
                    </div>
                </div>
            </form>
        </>
    );
}

export default InstrumentCreation;