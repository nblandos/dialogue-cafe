import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import BookingDetails from '../../components/confirmation/BookingDetails';
import InputFieldWithMic from '../../components/confirmation/InputFieldWithMic';
import ConfirmationActions from '../../components/confirmation/ConfirmationActions';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots } = location.state || { selectedSlots: [] };

  // Format booking details
  let formattedDate = 'No date selected';
  let formattedTime = 'No time selected';

  if (selectedSlots.length) {
    const [dateStr] = selectedSlots[0].split('T');
    const times = selectedSlots
      .map((slot) => parseInt(slot.split('T')[1]))
      .sort((a, b) => a - b);

    const startTime = `${times[0]}:00`;
    const endTime = `${times[times.length - 1] + 1}:00`;

    formattedDate = format(parseISO(dateStr), 'EEEE, dd MMM yyyy');
    formattedTime = `${startTime} - ${endTime}`;
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
  });

  const [recordingField, setRecordingField] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = React.useRef(null);

  const preprocessEmail = (transcript) => {
    return transcript
      .replace(/\bat\b/gi, '@')
      .replace(/\bdot\b/gi, '.')
      .replace(/\s+/g, '');
  };

  const startRecording = (field) => {
    if (
      !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    recognition.start();
    setRecordingField(field);
    setIsProcessing(true);

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript.trim();

      if (field === 'email') {
        transcript = preprocessEmail(transcript);
      }

      if (field === 'name') {
        setName(transcript);
      } else if (field === 'email') {
        setEmail(transcript);
      }

      setRecordingField('');
      setIsProcessing(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setRecordingField('');
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setRecordingField('');
      setIsProcessing(false);
    };
  };

  const stopRecording = () => {
    if (recordingField && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setRecordingField('');
      setIsProcessing(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFullName = (name) => {
    return name.trim().split(' ').length >= 2;
  };

  const handleConfirm = async () => {
    stopRecording();
    setApiError('');
    setErrors({
      name: false,
      email: false,
    });

    const isEmailValid = validateEmail(email);
    const isNameValid = validateFullName(name);

    if (!isEmailValid || !isNameValid) {
      setErrors({
        email: !isEmailValid,
        name: !isNameValid,
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user: {
          email: email.trim(),
          full_name: name.trim(),
        },
        timeslots: selectedSlots.map((slot) => ({
          start_time: slot,
        })),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      // redirect to success page once implemented, for now redirect to schedule page
      navigate('/', {
        state: {
          bookingId: data.id,
          email: email,
        },
      });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    stopRecording();
    navigate('/');
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6 pt-36">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Confirm Your Booking
      </h1>

      <BookingDetails date={formattedDate} time={formattedTime} />

      <div className="w-full max-w-md">
        <InputFieldWithMic
          id="name"
          label="Full Name"
          placeholder="Enter your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onMicClick={() =>
            recordingField === 'name' ? stopRecording() : startRecording('name')
          }
          recordingField={recordingField}
          isProcessing={isProcessing}
        />

        <InputFieldWithMic
          id="email"
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onMicClick={() =>
            recordingField === 'email'
              ? stopRecording()
              : startRecording('email')
          }
          recordingField={recordingField}
          isProcessing={isProcessing}
        />
      </div>

      {apiError && (
        <div className="mb-4 w-full max-w-md text-center text-red-500">
          {apiError}
        </div>
      )}

      <ConfirmationActions
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        loading={loading}
        errors={errors}
      />
    </div>
  );
}

export default ConfirmationPage;
