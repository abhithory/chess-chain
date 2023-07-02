import React from 'react'

function MovesHistroy({ movesHistory }: { movesHistory: string[] }) {
    return (
        <div className='glassmorphism-box w-[20rem] h-full text-center'>
            <h1 className="text-lg">Moves Histroy</h1>
            {movesHistory && movesHistory.map((item, key) => {
                return (
                    <span key={key}>{item}</span>
                )
            })}

        </div>
    )
}

export default MovesHistroy