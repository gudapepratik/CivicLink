import React from 'react'
import { Button } from "@chakra-ui/react"
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"

function MenuList({triggerTitle, menuItems, triggerButtonStyles}) {
  return (
    <MenuRoot >
      <MenuTrigger asChild>
        <Button variant="outline" size="sm" className={triggerButtonStyles}>
          {triggerTitle}
        </Button>
      </MenuTrigger>
      <MenuContent>
        {menuItems.map((item,index) => (
            <MenuItem key={index} value={item.label} onClick={item.onClickHandler}>{item.label}</MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  )
}

export default MenuList
