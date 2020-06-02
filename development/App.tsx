import React from 'react'
import { InfiniteList } from '../src'

const App = (): JSX.Element => {
  const mockItems = React.useMemo(() => {
    const items = []
    for (let index = 0; index < 100000; index++) {
      items.push(
        <div
          key={index}
          style={{
            width: '300px',
            height: '100px',
            backgroundColor: 'grey',
            border: '1px solid red',
          }}
        >
          Test item {index}
        </div>
      )
    }
    return items
  }, [])

  return (
    <InfiniteList
      style={{
        width: '300px',
        border: '1px solid green',
        marginTop: '10px',
        marginLeft: '10px',
        padding: 0,
        maxHeight: '500px',
        overflowY: 'auto',
        overflowX: 'hidden',
        listStyle: 'none',
      }}
      itemHeight={102}
    >
      {mockItems}
    </InfiniteList>
  )
}

export default App
