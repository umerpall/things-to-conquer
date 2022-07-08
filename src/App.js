import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [todoItems, setTodoItems] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');

  useEffect(()=>{
    const getItems = async () => {
      const todos = await axios.get('https://things-to-conquer.herokuapp.com//items')
      setTodoItems(todos.data);
    }
    getItems();
  }, [])


  const addItems = async () => {
    const todos = await axios.post('https://things-to-conquer.herokuapp.com//items',
      {
        item: inputVal
      }
    )
    setTodoItems((prevTodos)=>([...prevTodos, todos.data]))
    setInputVal('');
  }

  const deleteItem = async(id) => {
    await axios.delete(`https://things-to-conquer.herokuapp.com//items/${id}`)
    const newListItems = todoItems.filter((todo)=>(todo._id !== id))
    // console.log(newListItems)
    setTodoItems(newListItems)
  }

  const updateItem = async() => {
    await axios.put('https://things-to-conquer.herokuapp.com//items/' + isUpdating, {item:updateItemText})
    const updatedItemID= todoItems.findIndex((item)=>item._id === isUpdating)
    todoItems[updatedItemID].item = updateItemText
    setIsUpdating('')
    setUpdateItemText('')
  }

  const renderForm = () => (
    <>
      <input class='update-input' type="text" value={updateItemText} placeholder="Add Updated Item" onChange={(e)=>setUpdateItemText(e.target.value)}/>
      <button class='update-btn' onClick={()=>updateItem()}>Update</button>
    </>
  )

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="container">
        <div className="input-part">
          <input type="text" placeholder="Add an Item" value={inputVal} onChange={(e)=>setInputVal(e.target.value)} />
          <button onClick={()=>addItems()}>Add</button>
        </div>
        <div className="items-list">
          {todoItems.map((todo)=>(
            <div className="item" key={todo._id}>
              {
                isUpdating === todo._id
                ? renderForm()
                : <>
                    <p>{todo.item}</p>
                    <div>
                      <button onClick={()=>setIsUpdating(todo._id)}>Update</button>
                      <button onClick={()=>deleteItem(todo._id)}>Delete</button>
                    </div>
                  </>
              }
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
