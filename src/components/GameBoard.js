import React from 'react'

const GameBoard = ({ categories, questions }) => {
    return (
        <div>
            { categories.map((category, i) => (
                <div>
                    <h3>{category.name}</h3>
                    {questions[i].map(question => (
                        <div>
                            <p>{question.question}</p>
                            <p>{question.answer}</p>
                            <p>{question.value}</p>
                        </div>)
                    )}
                </div>
            ))}
        </div>
    )
}


export default GameBoard