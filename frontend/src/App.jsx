// App.jsx
import { useState, useEffect } from 'react';
import Form from './components/Form';

const App = () => {
  const [questionnaires, setQuestionnaires] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionnairesResponse = await fetch('http://localhost:3001/questionnaires');
        const questionnairesData = await questionnairesResponse.json();
        console.log('Cuestionarios:', questionnairesData);
        setQuestionnaires(questionnairesData);
      } catch (error) {
        console.error('Error al cargar datos:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleQuestionnaireSubmit = async (questions) => {
    try {
      // Enviar el cuestionario al servidor (si es necesario)
      console.log('Cuestionario enviado:', questions);

      // Actualizar el estado con el nuevo cuestionario
      setQuestionnaires((prevQuestionnaires) => [...prevQuestionnaires, { questions }]);
    } catch (error) {
      console.error('Error al enviar el cuestionario:', error.message);
      throw error;
    }
  };

  return (
    <div className="App">
      <Form onQuestionnaireSubmit={handleQuestionnaireSubmit} setQuestionnaires={setQuestionnaires} />

      <h1>Lista de Cuestionarios</h1>
      <ul>
        {questionnaires.map((questionnaire, index) => (
          <li key={index}>
            <h3>Cuestionario {index + 1}:</h3>
            <ul>
              {questionnaire.questions.map((question, questionIndex) => (
                <li key={questionIndex}>
                  {question.question}
                  <ul>
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      
    </div>
  );
};

export default App;
