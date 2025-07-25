import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechRecognition = ({
  lang = "en-US",
  continuous = true,
  interimResults = true,
}: SpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionErrorEvent['error'] | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const onResultRef = useRef<(result: { final: string; interim: string; }) => void>(() => { });


  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('not-allowed');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = lang;
    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = interimResults;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript
        if (result.isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }


      if (onResultRef.current) {
        onResultRef.current({ final: finalTranscriptRef.current.trim(), interim: interimTranscript.trim() });
        finalTranscriptRef.current = ""
      }
    };

    recognitionRef.current.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
    setError(null);
    setIsListening(true);
  }, [lang, continuous, interimResults]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      finalTranscriptRef.current = ""
    }
    setIsListening(false);
  }, []);

  const setOnResult = (callback: (result: { final: string; interim: string; }) => void) => {
    onResultRef.current = callback;
  };

  return {
    isListening,
    error,
    setOnResult,
    startListening,
    stopListening,
  };
};