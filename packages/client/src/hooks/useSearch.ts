import { Search } from 'js-search'
import { useEffect, useRef, useState } from 'react'

export type UseSearchOptions<T extends {}, U = Extract<keyof T, string>> = {
  /**
   * What to search on.
   */
  collection: Array<T>

  /**
   * A field that uniquely identifies the object
   */
  uidFieldName: U

  /**
   * Searchable field or field path. Pass a string for top-level field and an array of strings for nested fields.
   *
   */
  indexes: Array<U | string[]>

  /**
   * Show entire collection when there is no search desired
   */
  showAllResultsWhenSearchTextEmpty?: boolean
}

export const useSearch = <T extends {}>({
  collection,
  uidFieldName,
  indexes = [],
  showAllResultsWhenSearchTextEmpty = true,
}: UseSearchOptions<T>) => {
  const [searchText, setSearchText] = useState('')
  const searchInstance = useRef<Search>()

  // Can't change indexes once mounted with how this is written
  useEffect(() => {
    searchInstance.current = new Search(uidFieldName)
    indexes.forEach((index) => searchInstance.current!.addIndex(index))
    searchInstance.current!.addDocuments(collection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const results =
    showAllResultsWhenSearchTextEmpty && !searchText
      ? collection
      : (searchInstance.current!.search(searchText) as T[])

  return { results, searchText, setSearchText }
}
