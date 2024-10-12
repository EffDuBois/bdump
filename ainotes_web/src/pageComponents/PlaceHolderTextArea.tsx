import { subtextFont, titleFont } from '@/ui/fonts';
import React from 'react';

interface PlaceHolderTextAreaProps {
    isRecording: boolean;
}

const PlaceHolderTextArea: React.FC<PlaceHolderTextAreaProps> = ({ isRecording }) => {
    return (
        <div className={`${isRecording && "animate-pulse"}`}>
            <p>
                Hey I am your
                <span className={titleFont.className}>NoteTaker</span> assistant,
                I will help take your notes for you-
                <br />I can-
            </p>
            <ol className="list-disc">
                <li>Format your notes for you</li>
                <li>Make summaries for you</li>
                <li>Take down lists for you</li>
                <li>Lookup things from your notes</li>
                <li className={subtextFont.className}>
                    <s>Make Chicken Noodles for you</s>
                </li>
            </ol>
        </div>
    );
};

export default PlaceHolderTextArea;