import React, { useState } from 'react';
import * as Tone from "tone";

import "../styles/Timeline.css";

import Timeline from "./Timeline";
import ControlButton from './ControlButton';
import TimelineList from './TimelineList';


// Компонент контроллера таймлайнов
const TimelineController = ({ activeSynth }) => {
    
    // Настройки таймлайнов
    const [octave, setOctave] = useState(['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']); // Состояние списка нот на таймлайне
    const [rowNumber, setRowNumber] = useState(octave.length); // Состояние, определяющее количество строк на таймлайне
    const [columnNumber, setColumnNumber] = useState(16); // Состояние, определяющее количество столбцов на таймлайне
    
    // Инициализация пустой сетки таймлайна
    const cellsArray = Array(columnNumber).fill().map(() => Array(rowNumber).fill(false));
    
    // Таймлайны
    const [timelines, setTimelines] = useState([{cells: cellsArray, id: Date.now()}]); // Состояние списка существующих таймлайнов
    const [activeTimeline, setActiveTimeline] = useState(timelines[0]); // Состояние активного таймлайна
    
    // Ноты и сохраненные композиции
    const [notes, setNotes] = useState([]); // Состояния списка нот для проигрывания композиции
    const [savedSong, setSavedSong] = useState([]); // Состояние сохраненной композиции
    
    // Опции музыки
    const [isLooped, setIsLooped] = useState(false); // Состояние, определяющее вид проигрывания музыки при нажатии кнопки Play: false - один раз, true - зацикленно



    // Функция создания нового таймлайна
    const createTimeline = (newTimeline) => {
        setTimelines([...timelines, newTimeline]);
    }

    // Функция смены активного таймлайна
    const changeTimeline = (timelineId) => {
        for (let i = 0; i < timelines.length; i++) {
            if (timelines[i].id === timelineId) {
                setActiveTimeline(timelines[i]);
            }
        }
    }

    // Функция удаления активного таймлайна
    const removeTimeline = () => {
        if (timelines.length > 1) {
            setTimelines(timelines.filter(t => t.id !== activeTimeline.id));
            changeTimeline(timelines[0].id);
        }
        else {
            changeTimeline(timelines[0].id);
        }
    }

    // Функция проигрывания мелодии один раз
    const playSongOnce = () => {
        let delay = 0;
        if (notes[0]) {
            delay = notes[0].order * 0.4;
        }

        for (let i = 0; i < notes.length; i++) {
            const synth = new Tone.PolySynth();  // Создается новый полифонический синтезатор
            synth.set(notes[i].synth); // Синтезатору выставляются значения ноты
            synth.toDestination(); // Ситезатор подключается к выходу
            
            const now = Tone.now();
            // Добавление места между нотами
            if (notes[i - 1]) {
                delay += (notes[i].order - 1 - notes[i - 1].order) * 0.4;
            }
            synth.triggerAttackRelease(notes[i].pitch, notes[i].duration, now + delay);
            delay += notes[i].timing;
        }
    }

    // Функция проигрывания мелодии в цикле
    const playSongOnLoop = () => {
        console.log('started playing song on loop');
    }

    // Функция сброса сохраненной композиции
    const resetSong = () => {
        setNotes([]);
    }

    // Функция добавления ноты в композицию
    const addNote = (newNote) => {
        const newNotes = [...notes, newNote];
        newNotes.sort((a, b) => {return a.order - b.order});
        setNotes(newNotes);
    }

    // Функция удаления ноты
    const removeNote = (noteToRemove) => {
        // Убираем из списка нужную ноту по столбцу и колонке
        const newNotes = notes.filter(x => {
            if (x.order === noteToRemove.order && x.pitch === noteToRemove.pitch) {
                return false;
            }
            return true;
        });
        setNotes(newNotes);
    }

    // Функция сохранения композиции
    const saveSong = () => {
        var songToSave = {
            author: "Vasya Pupkin",
            notes: notes,
            cells: activeTimeline.cells
        };

        setSavedSong(songToSave);
    }

    // Функция загрузки композиции
    const loadSong = () => {
        setNotes(savedSong.notes);
        setActiveTimeline({...activeTimeline, cells: savedSong.cells});
    }

    // Функция обновления ячеек таймлайна
    const updateCellValues = (TimelineCellValues) => {
        setActiveTimeline({...activeTimeline, cells: TimelineCellValues});
        const updatedTimelines = timelines.map(timeline => {
            if (timeline.id === activeTimeline.id) {
                return {...timeline, cells: TimelineCellValues};
            }
            return timeline;
        });
        setTimelines(updatedTimelines);
    }

    return (
        <div className="timeline">
            <div className="timeline_controlButtons">
                <ControlButton
                    handleClick={() => createTimeline({cells: cellsArray, id: Date.now()})}
                    className="controlButtonTimeline"
                >
                    Add timeline
                </ControlButton>
                <ControlButton
                    handleClick={removeTimeline}
                    className="controlButtonTimeline"
                >
                    Delete active timeline
                </ControlButton>
            </div>
            
            
            <TimelineList
                timelines={timelines}
                activeId={activeTimeline.id}
                changeTimeline={changeTimeline}
            />

            <Timeline
                octave={octave}
                cellValues={activeTimeline.cells}
                addNote={addNote}
                removeNote={removeNote}
                updateCellValues={updateCellValues}
                activeSynth={activeSynth}
            />

            <div className="timeline_songButtons">
                <ControlButton
                    handleClick={() => {setIsLooped(!isLooped)}}
                    className="timeline_songButtons_loop"
                    id="songLoopButton"
                >
                    Loop {isLooped ? '✔' : '✖'}
                </ControlButton>
                <ControlButton
                    handleClick={isLooped ? playSongOnLoop : playSongOnce}
                    className="controlButton"
                >
                    Play {'>'}
                </ControlButton>
                <ControlButton
                    handleClick={resetSong}
                    className="controlButton"
                >
                    Reset
                </ControlButton>
                <ControlButton
                    handleClick={saveSong}
                    className="controlButton"
                >
                    Save
                </ControlButton>
                <ControlButton
                    handleClick={loadSong}
                    className="controlButton"
                >
                    Load
                </ControlButton>
            </div>
        </div>
    );
}

export default TimelineController;