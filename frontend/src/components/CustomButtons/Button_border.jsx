import React from 'react'

function Button_Border({px,py,onClick, label, bordercolor, textColor}) {
  return (
    <button onClick={onClick} className={`px-8 py-1 ${textColor} font-[400] font-outfit border rounded-md ${bordercolor}`}>
        {label}
    </button>
  )
}

export default Button_Border