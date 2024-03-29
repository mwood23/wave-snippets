import styled from '@emotion/styled'
import { InputStep } from '@waves/shared'
import { head } from 'ramda'
import React, { FC, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

// import { CODE_THEMES_DICT } from '../code-themes'
import {
  BUILDER_MOBILE_BREAKPOINT,
  SUPPORTED_CODING_LANGAUGES_DICT,
} from '../const'
import { usePreviewDispatch, useSnippetDispatch } from '../context'
import {
  Box,
  BoxProps,
  Button,
  Collapse,
  Flex,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  numberOfSteps: number
  activeStep: string | undefined
  onExpandClick: (id: string) => void
}

const BottomActionRow = styled(Box)<{ isDraggingOverDroppable: boolean }>`
  transition: opacity 100ms linear;
  opacity: ${(props) => (props.isDraggingOverDroppable ? '0' : '1')};
  display: flex;
  justify-content: flex-end;
`

export const PanelItem: FC<PanelItemProps> = ({
  step,
  // theme,
  index,
  numberOfSteps,
  onExpandClick,
  activeStep,
  currentStep,
}) => {
  const snippetDispatch = useSnippetDispatch()
  const previewDispatch = usePreviewDispatch()
  const stepNumber = index + 1
  const isActive = activeStep === step.id
  const isShowingInPreview = currentStep === index

  return (
    <Draggable draggableId={step.id} index={index} key={step.id}>
      {(provided, _snapshot) => (
        <Box mb="4" ref={provided.innerRef} {...provided.draggableProps}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <IconButton
                aria-label="Drag handle"
                icon="drag-handle"
                mr="2"
                size="sm"
                variant="ghost"
                {...provided.dragHandleProps}
              />
              <Text fontSize="xl" mr="2">
                Step {stepNumber}
              </Text>
              <Box
                backgroundColor="green.400"
                borderRadius="50%"
                height="10px"
                opacity={isShowingInPreview ? 1 : 0}
                transition="opacity 0.3s"
                width="10px"
              />
            </Flex>

            <Box>
              <IconButton
                aria-label="Remove Step"
                icon={'delete'}
                isDisabled={numberOfSteps <= 1}
                mr="2"
                onClick={() => {
                  snippetDispatch({ type: 'removeStep', stepID: step.id })
                }}
                size="xs"
                variant="ghost"
              />
              <IconButton
                aria-label="Toggle panel show"
                icon={isActive ? 'chevron-down' : 'chevron-up'}
                onClick={() => {
                  onExpandClick(step.id)

                  if (isActive) {
                    previewDispatch({ type: 'setStep', step: 0 })
                  }
                }}
                size="xs"
                variant="ghost"
              />
            </Box>
          </Flex>
          <Collapse isOpen={isActive} mt="4">
            <Box>
              <FormControl mb="2">
                <Input
                  id={`title-step-${stepNumber}`}
                  name="Title"
                  onChange={(e: any) => {
                    snippetDispatch({
                      type: 'updateStep',
                      stepID: step.id,
                      title: e.target.value,
                    })
                  }}
                  placeholder="Title"
                  size="sm"
                  value={step.title}
                />
              </FormControl>
              <FormControl mb="4">
                <Input
                  id={`subtitle-step-${stepNumber}`}
                  name="Subtitle"
                  onChange={(e: any) => {
                    snippetDispatch({
                      type: 'updateStep',
                      stepID: step.id,
                      subtitle: e.target.value,
                    })
                  }}
                  placeholder="Subtitle"
                  size="sm"
                  value={step.subtitle}
                />
              </FormControl>
            </Box>
            <Editor
              language={
                SUPPORTED_CODING_LANGAUGES_DICT[step.lang].codeMirrorMap
              }
              onChange={(_editor, _details, value) => {
                snippetDispatch({
                  type: 'updateStep',
                  stepID: step.id,
                  ...value,
                })
              }}
              onFocusChanged={(newFocus, stepID) => {
                snippetDispatch({
                  type: 'updateStep',
                  stepID,
                  focus: newFocus,
                })
              }}
              step={step}
              // theme={CODE_THEMES_DICT[theme].codeMirrorMap}
            />
          </Collapse>
        </Box>
      )}
    </Draggable>
  )
}

const StyledPanelContainer = styled(Box)`
  @media (max-width: ${BUILDER_MOBILE_BREAKPOINT}) {
    padding-right: 0;
    margin-top: 2rem;
  }
`

export const Panel: FC<PanelProps> = ({
  steps,
  currentStep,
  containerStyleProps = {},
  theme,
}) => {
  const [activeStep, setActiveStep] = useState(head(steps)?.id)
  const snippetDispatch = useSnippetDispatch()
  const previewDispatch = usePreviewDispatch()
  return (
    <DragDropContext
      onDragEnd={(dropResult, _provided) => {
        snippetDispatch({ type: 'reorderStep', dropResult })
      }}
    >
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <StyledPanelContainer
            paddingRight="4"
            {...containerStyleProps}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Box mb="2">
              {steps.map((step, index) => (
                <PanelItem
                  activeStep={activeStep}
                  currentStep={currentStep}
                  index={index}
                  key={step.id}
                  numberOfSteps={steps.length}
                  onExpandClick={(id: string) => {
                    setActiveStep((currentActiveID) =>
                      currentActiveID === id ? undefined : id,
                    )
                    previewDispatch({ type: 'setStep', step: index })
                  }}
                  step={step}
                  theme={theme}
                />
              ))}
            </Box>

            <BottomActionRow
              isDraggingOverDroppable={snapshot.isDraggingOver}
              padding="0 0 2px 2px"
            >
              {steps.length >= 20 ? (
                <Text>Cannot add more than 20 steps.</Text>
              ) : (
                <Menu>
                  {/*
                  // @ts-ignore As coercion type lost */}
                  <MenuButton as={Button} rightIcon="chevron-down" size="sm">
                    Add Step
                  </MenuButton>
                  <MenuList placement="top-start" zIndex={1000}>
                    <MenuItem
                      onClick={() => snippetDispatch({ type: 'addStep' })}
                    >
                      Add Blank Step
                    </MenuItem>
                    {steps.length > 0 && (
                      <MenuItem
                        onClick={() =>
                          snippetDispatch({ type: 'duplicateLastStep' })
                        }
                      >
                        Duplicate Previous Step
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </BottomActionRow>
          </StyledPanelContainer>
        )}
      </Droppable>
    </DragDropContext>
  )
}
