import { useState } from "react";
import { useReducer } from "react";


//1. state에 대한 interface 정의
interface IState{
    counter: number;
}
//2. reducer에 대한 interface 정의
interface IAction{
    type: 'INCREMENT' | 'DECREMENT' | 'RESET';
}


function reducer(state: IState, action: IAction): IState{
    const {type} = action;
    console.log(state);

    switch(type){
        case 'INCREMENT':
            return {
                ...state,
                counter: state.counter + 1
            };

        case 'DECREMENT':
            return {
                ...state,
                counter: state.counter - 1
            };

        case 'RESET':
            return {
                ...state,
                counter: 0
            };

        default:
            return state;
       
    }
}

const UseReducerPage = () => {

    //1. useState를 사용하여 상태 관리
    const [count, setCount] = useState(0);


    //2. useReducer를 사용하여 상태 관리
    const [state, dispatch] = useReducer(reducer, {counter: 0});


    const handleIncrement = () => {
        setCount(count + 1);
    }

 
  return (
    <div className="flex flex-col gap-10">
        <div>
            <h2 className="text-3xl font-bold">useState</h2>
            <h2 >useState훅 사용: {count}</h2>
            <button    className="mt-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                onClick={() => setCount(count + 1)}>Increment</button>
        </div>
        <div>
            <h2 className="text-3xl font-bold">useReducer</h2>
            <h2 >useReducer훅 사용: {state.counter}</h2>
            <button  className="mt-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                onClick={() => dispatch({type: 'INCREMENT'})}>Increment</button>
            <button   className="mt-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                onClick={() => dispatch({type: 'DECREMENT'})}>Decrement</button>
            <button   className="mt-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                onClick={() => dispatch({type: 'RESET'})}>Reset</button>
        </div>
    </div>


  )
};

export default UseReducerPage;