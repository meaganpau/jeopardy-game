import React from 'react';
import WelcomeScreen from './pages/WelcomeScreen'
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
  }

  buildGame = () => {
    // Get max number of categories
    axios.get(`${baseUrl}/categories`)
      .then(res => {
        this.setState({ maxCategories: res.data[0].id }, () => {
          const retrieveCategories = this.getCategories();
          if (retrieveCategories) {
            this.layoutGame()
          }
        })
      })
  }

  getCategories = () => {
    const { categories, maxCategories } = this.state;
    if (categories.length < numberOfCategories) {
      // Get random category
      const categoryID = this.getRandomInt(maxCategories);

      axios.get(`${baseUrl}/clues?category=${categoryID}`)
        .then(res => {
          if (res.data.length >= numberOfQuestionsPerCategory) {
            const questions = this.getQuestionsFromCategory(res.data);
            if (questions.length === numberOfQuestionsPerCategory) {
              this.setState({ 
                categories: [...this.state.categories, categoryID],
                questions: [...this.state.questions, [...questions]],
              })
            }
          }
          this.getCategories();
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
    } else {
      console.log(this.state);
    }
  }

  getRandomInt = max => Math.floor(Math.random() * Math.floor(max));
  
  getQuestionsFromCategory = arr => {
    const questions = []
    points.map(point => {
      const question = arr.find(obj => {
        if (obj.value === point) {
          return obj.value === point
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

  layoutGame = () => {
    console.log(this.state);
  }

  render() {
  const Context = React.createContext(this.state);

    return (
      <Context.Provider>
        <div className="App">
          <WelcomeScreen gameInit={this.buildGame}/>
        </div>
      </Context.Provider>
  );
  }
}

export default App;
