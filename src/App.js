import React, { useState, useEffect } from 'react';
import WelcomeScreen from './pages/WelcomeScreen'
import Loading from './components/Loading'
import GameBoard from './components/GameBoard'
import Game from './services/game'

const App = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readyToPlay, setReadyToPlay] = useState(false);
  const game = new Game();

  const buildGame = async () => {
    setLoading(true)
    await game.getAndSetMaxCategories();
    await game.fetchAndSetCategories();
    setCategories(game.categories);
    setQuestions(game.questions);
  }

  useEffect(() => {
    if (categories.length && questions.length) {
      setLoading(false);
      setReadyToPlay(true);
    }
  }, [categories, questions])
   
  return (
      <div className="App">
        { readyToPlay ? <GameBoard categories={categories} questions={questions} /> : <WelcomeScreen gameInit={buildGame}/> }
        { loading ? <Loading text="Generating questions..." /> : null }
      </div>
  );
}

export default App;
