import React from 'react'

function MovesHistroy({ movesHistory }: { movesHistory: string[] }) {
    return (
        <div className='glassmorphism-box w-[20rem] max-h-[80vh] h-[80vh]  text-center overflow-y-auto'>
            <h1 className="text-lg text-white mb-2">Moves Histroy</h1>

                <div
                    // style={{ maxHeight: `${boardSize}px` }}
                    className="grid grid-cols-2 gap-2 text-center text-text-color "
                >
                    <span className='font-bold border-b-2'>White</span>
                    <span className='font-bold border-b-2'>Black</span>
                    {movesHistory && movesHistory.map((item, key) => {
                        return (
                        <span key={key} className='text-sm'>{item}</span>
                    )
                })}


            </div>


        </div>
    )
}

export default MovesHistroy