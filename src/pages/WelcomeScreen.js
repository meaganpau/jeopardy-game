import React from 'react'
// import MainTitle from '../components/MainTitle'

const WelcomeScreen = ({ gameInit }) => (
    <div>
        <h1>Welcome to Jeopardy!</h1>
        <button onClick={ gameInit }>Create Game</button>
    </div>
)


export default WelcomeScreen