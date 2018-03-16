import React from "react"


const UdoRedo = ({history, onClick}) => {
    return (
        <ul>
            {history.map((his, index) => {
                return <li key={his}>
                    <button
                        onClick={() => onClick(index)}>
                        {index}
                    </button>
                </li>
            })}

        </ul>
    )
}
export default UdoRedo;