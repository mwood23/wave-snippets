import React, { FC } from 'react'

import { CODE_THEMES_DICT } from '../code-themes'
import { SUPPORTED_CODING_LANGAUGES_DICT } from '../const'
import { InputStep, useSnippetDispatch } from '../context'
import {
  Box,
  BoxProps,
  Collapse,
  Flex,
  FormControl,
  IconButton,
  Input,
  Text,
} from './core'
import { Editor } from './Editor'

export type PanelProps = {
  steps: InputStep[]
  currentStep: number
  containerStyleProps?: BoxProps
  theme: string
}

export type PanelItemProps = {
  step: InputStep
  index: number
  currentStep: number
  containerStyleProps?: BoxProps
  theme: string
  initialActive?: boolean
}

export const PanelItem: FC<PanelItemProps> = ({
  step,
  theme,
  index,
  initialActive = false,
}) => {
  const [show, setShow] = React.useState(initialActive)
  const dispatch = useSnippetDispatch()
  const stepNumber = index + 1

  return (
    <Box mb="4">
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xl">Step {stepNumber}</Text>
        <IconButton
          aria-label="Toggle panel show"
          icon={show ? 'minus' : 'add'}
          onClick={() => {
            return setShow(!show)
          }}
          size="xs"
          variant="ghost"
        />
      </Flex>
      <Collapse isOpen={show} mt="4">
        <Box>
          <FormControl mb="2">
            <Input
              id={`title-step-${stepNumber}`}
              name="Title"
              placeholder="Title"
              size="sm"
            />
          </FormControl>
          <FormControl mb="4">
            <Input
              id={`subtitle-step-${stepNumber}`}
              name="Subtitle"
              placeholder="Subtitle"
              size="sm"
            />
          </FormControl>
        </Box>
        <Editor
          language={SUPPORTED_CODING_LANGAUGES_DICT[step.lang].codeMirrorMap}
          onChange={(_editor, _details, value) => {
            dispatch({ type: 'updateStep', stepID: step.id, code: value })
          }}
          onFocusChanged={(newFocus, stepID) => {
            dispatch({ type: 'updateStep', stepID, focus: newFocus })
          }}
          step={step}
          theme={CODE_THEMES_DICT[theme].codeMirrorMap}
        />
      </Collapse>
    </Box>
  )
}

export const Panel: FC<PanelProps> = ({
  steps,
  currentStep,
  containerStyleProps = {},
  theme,
}) => {
  return (
    <Box paddingRight="4" {...containerStyleProps}>
      {steps.map((step, index) => {
        return (
          <PanelItem
            currentStep={currentStep}
            index={index}
            initialActive={index === 0}
            key={step.id}
            step={step}
            theme={theme}
          />
        )
      })}
    </Box>
  )
}
