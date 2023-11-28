import { useQuery, useMutation, useQueryClient } from 'react-query';

import './App.css';
import { useState } from 'react';

const fetchData = async () => {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos');
  response = await response.json();
  return response;
};

const createData = async (title) => {
  await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      completed: true,
      id: 1,
      userId: 4,
    }),
  });
};

function App() {
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryFn: () => fetchData(),
    queryKey: [count],
  });

  const { mutateAsync } = useMutation({
    mutationFn: () => createData(title),
    onSuccess: () => {
      queryClient.invalidateQueries([count]);
    },
  });

  return (
    <>
      <input
        value={title}
        type="text"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={async () => {
          await mutateAsync();
          setTitle('');
        }}
      >
        Add To do
      </button>
      <button
        onClick={() => {
          setCount((count) => count + 1);
        }}
      >
        Change count
      </button>
      <p>Current Count: {count}</p>
      {!isLoading ? (
        data.map((dataObj) => {
          console.log('dataObj: ', dataObj);
          return (
            <>
              <p>{dataObj.title}</p>
              <p>{dataObj.completed}</p>
              <p>{dataObj.id}</p>
              <p>{dataObj.userId}</p>
            </>
          );
        })
      ) : (
        <>Loading...</>
      )}
    </>
  );
}

export default App;
