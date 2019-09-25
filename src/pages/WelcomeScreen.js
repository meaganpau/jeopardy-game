import React from 'react'

const WelcomeScreen = ({ gameInit }) => (
    <div>
        <h1>Welcome to Jeopardy!</h1>
        <button onClick={ gameInit }>Create Game</button>
    </div>
)


export default WelcomeScreen