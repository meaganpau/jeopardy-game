import React from 'react';
import WelcomeScreen from './pages/WelcomeScreen'
import Loading from './components/Loading'
import GameBoard from './components/GameBoard'
import axios from 'axios'

const baseUrl = 'http://jservice.io/api';
const numberOfCategories = 6;
const numberOfQuestionsPerCategory = 5;
const points = [200, 400, 600, 800, 1000];

class App extends React.Component {
  state = {
    categories: [],
    questions: [],
    user: {},
    maxCategories: 0,
    loading: false,
    readyToPlay: false,
  }

  buildGame = async () => {
    this.setState({ loading: true });
    // Get max number of categories
    try {
      const categoryRes = await axios.get(`${baseUrl}/categories`);
      this.setState({ maxCategories: categoryRes.data[0].id }, this.fetchAndSetCategories)
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  }

  fetchAndSetCategories = async () => {
    this.setState({ loading: false, readyToPlay: true })
    let fetchedCategories = 0;
    while(fetchedCategories < numberOfCategories) {
      try {
        const gotCategory = await this.getCategories();
        if (gotCategory) {
          fetchedCategories++;
        }
      } catch (e) {
        console.log(e);
        break;
      }
    }
  }

  getRandomCategory = maxCategories => {
    const randomCategory = this.getRandomInt(maxCategories)
    if (!this.state.categories.includes(randomCategory)) {
      return randomCategory;
    } else {
      this.getRandomCategory(maxCategories);
    }
  }
 
  getCategories = async () => {
    const { maxCategories } = this.state;
    // Get random category
    const categoryID = this.getRandomCategory(maxCategories);
    try {
      const categoryRes = await axios.get(`${baseUrl}/category?id=${categoryID}`);
      if (categoryRes.data.clues_count >= numberOfQuestionsPerCategory) {
        const questions = this.getQuestionsFromCategory(categoryRes.data.clues);
        if (questions.length === numberOfQuestionsPerCategory) {
          this.setState({ 
            categories: [...this.state.categories, {id: categoryID, name: categoryRes.data.title}],
            questions: [...this.state.questions, [...questions]],
          })
          return true;
        }
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  getRandomInt = max => Math.floor(Math.random() * Math.floor(max));
  
  getQuestionsFromCategory = arr => {
    const questions = []
    points.forEach(point => {
      const question = arr.find(question => {
        if (question.value === point && question.invalid_count === null) {
          return question.value === point
        } else {
          return false;
        }
      })

      if (question) {
        questions.push(question)
      }
    })
    return questions;
  }

  render() {
    const Context = React.createContext(this.state);
    const { loading, categories, questions, user, readyToPlay } = this.state;

    return (
      <Context.Provider>
        <div className="App">
          { readyToPlay ? <GameBoard categories={categories} questions={questions} /> : <WelcomeScreen gameInit={this.buildGame}/> }
          { loading ? <Loading text="Generating questions..." /> : null }
        </div>
      </Context.Provider>
  );
  }
}

export default App;
