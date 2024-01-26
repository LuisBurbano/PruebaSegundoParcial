// AdoptionForm.jsx
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const Form = ({ onQuestionnaireSubmit, setQuestionnaires }) => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: '', options: ['', '', ''], correctOption: '' },
    ]);
  };

  const handleQuestionChange = (index, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].question = value;
      return updatedQuestions;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options[optionIndex] = value;
      return updatedQuestions;
    });
  };

  const handleCorrectOptionChange = (questionIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].correctOption = value;
      return updatedQuestions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar el cuestionario al servidor
      const response = await fetch('http://localhost:3001/questionnaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      });

      if (response.ok) {
        const newQuestionnaire = await response.json();
        console.log('Cuestionario enviado:', newQuestionnaire);


        // Actualizar el estado con el nuevo cuestionario
        setQuestionnaires((prevQuestionnaires) => [...prevQuestionnaires, { id: prevQuestionnaires.length + 1, questions }]);

      } else {
        throw new Error('Error al enviar el cuestionario al servidor.');
      }
    } catch (error) {
      console.error('Error al enviar el cuestionario:', error.message);
      throw error;
    }

    // Limpiar el formulario después de enviar
    setQuestions([]);

  };


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Evaluación Personalizada</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <button type="button" className="btn btn-primary" onClick={addQuestion}>
            Agregar Pregunta
          </button>
        </div>

        {questions.map((question, index) => (
          <div key={index} >
            <h3>Pregunta {index + 1}:</h3>
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder="Escribe tu pregunta"
              className='form-control'
              required
            />

            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className='form-check'>
                <input
                  type="radio"
                  name={`question${index + 1}`}
                  value={String.fromCharCode(97 + optionIndex)}
                  onChange={() => handleCorrectOptionChange(index, String.fromCharCode(97 + optionIndex))}
                  checked={question.correctOption === String.fromCharCode(97 + optionIndex)}
                  className='form-check-input'
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  placeholder={`Opción ${String.fromCharCode(97 + optionIndex)}`}
                  className='form-control'
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <button type="submit" className="btn btn-success">Enviar Evaluación</button>
      </form>
    </div>
  );
};

export default Form;
