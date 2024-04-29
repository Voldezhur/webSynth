import React from "react";
import * as Tone from "tone";

import "../styles/App.css";

const InstrumentList = ({ setActiveSynth, synthList }) => {
    return (
        <>
            <ul>
                {
                    synthList.map(synth => <div key={synth.name} className="ditem"><li className="li-item">
                        <button className="synthbutton" onClick={() => {
                            // Изменение активного синтезатора на выбранный и однократное проирывание примера звука
                            setActiveSynth(synth)
                                
                            const tempSynth = new Tone.PolySynth();
                            tempSynth.set(synth);
                            tempSynth.toDestination();

                            tempSynth.triggerAttackRelease('B3', "64n");
                        }}>
                            {synth.name}
                        </button>
                    </li>
                    </div>)
                }
            </ul>
        </>
    );
}

export default InstrumentList;