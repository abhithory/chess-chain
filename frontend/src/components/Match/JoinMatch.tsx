import React from 'react'

function JoinMatch() {

    async function joinMatch() {

    }
    return (
        <form onSubmit={joinMatch}>
            <input className='basic_input' id='roomcode' name='roomcode' type="text" placeholder="code of room which you want to join" />
            <button className='basic_btn' type='submit'>
                Join Match
            </button>
        </form>
    )
}

export default JoinMatch