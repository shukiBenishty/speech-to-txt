import { useState, useCallback, useRef, useEffect } from "react";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { Editor } from "@tiptap/react";

interface SpeechProps {
    editor: Editor | null;
}

const getErrorMessage = (error: SpeechRecognitionErrorEvent['error'] | null) => {
    if (!error) return null;

    switch (error) {
        case 'no-speech':
            return 'No speech was detected. Please try again.';
        case 'audio-capture':
            return 'Audio capture failed. Please check your microphone settings.';
        case 'not-allowed':
            return 'Microphone access denied. Please enable it in your browser settings.';
        case 'aborted':
            return 'Speech recognition was aborted. Please try again.';
        case 'bad-grammar':
            return 'A grammar error occurred. Please check the speech recognition grammar.';
        case 'language-not-supported':
            return 'The selected language is not supported. Please choose a different language.';
        case 'network':
            return 'A network error occurred. Please check your internet connection.';
        case 'service-not-allowed':
            return 'The speech recognition service is not allowed. Please check your browser or extension settings.';
        default:
            return 'An unknown error occurred.';
    }
};

const Speech = ({ editor }: SpeechProps) => {
    const [language, setLanguage] = useState("he-IL");
    const interimIdRef = useRef<string>(null);
    const lastFinalRef = useRef<string>('');
    const { isListening, startListening, stopListening, setOnResult, error } = useSpeechRecognition({ lang: language });

    const handleSave = () => {
        if (editor) {
            const textToSave = editor.getText();
            const blob = new Blob([textToSave], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transcribed-text.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
    };


    const handleStartListening = useCallback(() => {
        lastFinalRef.current = '';
        startListening();
    }, [startListening]);

    const handleStopListening = useCallback(() => {
        if (editor && interimIdRef.current) {
            editor.commands.command(({ tr, state }) => {
                const { doc } = state;
                let from = -1, to = -1;

                doc.descendants((node, pos) => {
                    if (node.marks?.some(mark => mark.type.name === 'interim' && mark.attrs?.id === interimIdRef.current)) {
                        from = pos;
                        to = pos + node.nodeSize;
                        return false; // עצור לאחר שמצאת
                    }
                    return true;
                });

                if (from >= 0 && to >= 0) {
                    tr.delete(from, to);
                    return true;
                }
                return false;
            });

            interimIdRef.current = null; // איפוס הטקסט הזמני בסיום ההאזנה
        }

        stopListening();
    }, [stopListening, editor]);

    useEffect(() => {
        if (!editor) return;

        lastFinalRef.current = '';
        
        setOnResult(({ final, interim }) => {
            if (!editor) return;
        
            editor.commands.focus();
        
            // הסרת טקסט זמני קודם לפי ID
            if (interimIdRef.current) {
                editor.commands.command(({ tr, state }) => {
                    const { doc } = state;
                    let from = -1, to = -1;
        
                    doc.descendants((node, pos) => {
                        if (node.marks?.some(mark => mark.type.name === 'interim' && mark.attrs?.id === interimIdRef.current)) {
                            from = pos;
                            to = pos + node.nodeSize;
                            return false; 
                        }
                        return true;
                    });
        
                    if (from >= 0 && to >= 0) {
                        tr.delete(from, to);
                        return true;
                    }
                    return false;
                });
        
                interimIdRef.current = null;
            }
        
            // הוספת טקסט סופי – הגנה מפני כפילות
            if (final && final !== lastFinalRef.current) {
                editor.commands.insertContent(final + ' ');
                lastFinalRef.current = final; // שמירת הטקסט הסופי האחרון שהוכנס
            }
        
            // הוספת טקסט זמני חדש (כנראה לא יהיה בשימוש במובייל)
            if (interim) {
                const newId = `interim-${Date.now()}`;
                interimIdRef.current = newId;
                editor.commands.insertContent({
                    type: 'text',
                    text: interim,
                    marks: [{ type: 'interim', attrs: { id: newId } }],
                });
            }
        });

    }, [editor, setOnResult]);

    const errorMessage = getErrorMessage(error);

    return (
        <div className="controls-container">
            <div className="controls">
                <button
                    onClick={isListening ? handleStopListening : handleStartListening}
                    className={`control-button ${isListening ? 'listening' : ''}`}
                    disabled={!!error}
                >
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
                <select
                    onChange={(e) => setLanguage(e.target.value)}
                    value={language}
                    className="language-select"
                    disabled={isListening}
                >
                    <option value="en-US">English</option>
                    <option value="he-IL">Hebrew</option>
                </select>
                <button onClick={handleSave} className="control-button">
                    Save Text File
                </button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
}

export default Speech;