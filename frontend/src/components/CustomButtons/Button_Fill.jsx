import React from 'react'

function Button_Fill({onClick, label, bgcolor, hoverColor, textColor}) {
  return (
    <button onClick={onClick} className={`px-8 py-1 ${textColor} shadow-inner font-[400] font-outfit rounded-md ${bgcolor}`}>
        {label}
    </button>
  )
}

export default Button_Fill