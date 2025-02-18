import { Box, Collapsible } from "@chakra-ui/react"

export const CollapsibleBasic = ({question, answer}) => (
  <Collapsible.Root className="bg-zinc-100 rounded-sm dark:bg-zinc-800">
    <Collapsible.Trigger  className="font-outfit p-3 text-left">{question}</Collapsible.Trigger>
    <Collapsible.Content>
      <Box className="font-outfit p-3 border-t-[1px] text-left ">
        {answer}
      </Box>
    </Collapsible.Content>
  </Collapsible.Root>
)
