import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'

import { useSearch } from '../hooks'
import { isNil, noop } from '../utils'
import { Box, Input, useColorMode } from './core'

type GenericAutocompleteOption = { name: string; aliases?: string[] }

type AutocompleteProps<Option extends GenericAutocompleteOption> = {
  options: Option[]
  valueKey: Extract<keyof Option, string>
  onSelect: (params: {
    suggestion: Option
    suggestionValue: string
    suggestionIndex: number
    sectionIndex: number | null
    method: 'click' | 'enter'
  }) => void
  value: Option
}

/**
 * Styles from: https://github.com/chakra-ui/chakra-ui/blob/master/packages/chakra-ui/src/Menu/styles.js
 */
const Wrapper = styled(Box)`
  .react-autosuggest__container {
    position: relative;
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__suggestions-container--open {
    display: block;
    position: absolute;
    top: 41px;
    transition: background-color 220ms, color 220ms;
    width: 240px;
    border-width: 1px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    z-index: 1000;
    max-height: 270px;
    overflow-y: auto;
    background: #fff;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 5px 10px;
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: ${(props) => {
      // @ts-ignore
      return props.theme.colors.gray['200']
    }};
  }

  .react-autosuggest__container--dark {
    .react-autosuggest__suggestions-container--open {
      background: ${(props) => {
        // @ts-ignore
        return props.theme.colors.gray['700']
      }};
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px,
        rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px;
    }

    .react-autosuggest__suggestion--highlighted {
      background-color: ${(props) => {
        // @ts-ignore
        return props.theme.colors.whiteAlpha['200']
      }};
    }
  }
`

export const Autocomplete = <Option extends GenericAutocompleteOption>({
  options,
  value,
  valueKey,
  onSelect = noop,
}: AutocompleteProps<Option>) => {
  const [displayValue, setDisplayValue] = useState(value.name)
  const { searchText, setSearchText, results } = useSearch<Option>({
    collection: options,
    uidFieldName: valueKey,
    // @ts-ignore Types getting lost even though they're right :(
    indexes: ['name', 'aliases'],
  })
  const { colorMode } = useColorMode()

  useEffect(() => {
    if (!isNil(displayValue)) {
      setSearchText(displayValue)
    }
  }, [displayValue])

  useEffect(() => {
    setDisplayValue(value.name)
  }, [value.name])

  return (
    <Wrapper>
      <Autosuggest
        highlightFirstSuggestion
        focusInputOnSuggestionClick={false}
        getSuggestionValue={(suggestion) => {
          return suggestion[valueKey]
        }}
        inputProps={{
          onChange: (e) => {
            // @ts-ignore
            return setDisplayValue(e.target.value)
          },
          value: displayValue ?? searchText,
          type: 'search',
          placeholder: 'Search...',
        }}
        multiSection={false}
        onSuggestionSelected={(_event, params) => {
          setDisplayValue(params.suggestion.name)
          onSelect(params)
        }}
        onSuggestionsClearRequested={() => {
          setDisplayValue(value.name)
        }}
        onSuggestionsFetchRequested={({ reason }) => {
          if (
            [
              'input-focused',
              'escape-pressed',
              'suggestions-revealed',
              'suggestion-selected',
            ].includes(reason)
          ) {
            setSearchText('')
          }
        }}
        renderInputComponent={(props) => {
          // @ts-ignore Types fighting, but looks harmless
          return <Input {...props} type="input" />
        }}
        renderSuggestion={(suggestion) => {
          return <Box>{suggestion.name}</Box>
        }}
        shouldRenderSuggestions={() => {
          return true
        }}
        suggestions={results}
        theme={{
          container: `react-autosuggest__container ${
            colorMode === 'dark' ? 'react-autosuggest__container--dark' : ''
          }`,
          containerOpen: 'react-autosuggest__container--open',
          input: 'react-autosuggest__input',
          inputOpen: 'react-autosuggest__input--open',
          inputFocused: 'react-autosuggest__input--focused',
          suggestionsContainer: 'react-autosuggest__suggestions-container',
          suggestionsContainerOpen:
            'react-autosuggest__suggestions-container--open',
          suggestionsList: 'react-autosuggest__suggestions-list',
          suggestion: 'react-autosuggest__suggestion',
          suggestionFirst: 'react-autosuggest__suggestion--first',
          suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
          sectionContainer: 'react-autosuggest__section-container',
          sectionContainerFirst: 'react-autosuggest__section-container--first',
          sectionTitle: 'react-autosuggest__section-title',
        }}
      />
    </Wrapper>
  )
}
