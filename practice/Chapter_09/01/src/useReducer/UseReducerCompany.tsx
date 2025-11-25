import type { ChangeEvent } from "react";
import { useReducer, useState } from "react";

interface IState{
    department: string;
    error: string | null;
}

interface IAction{
    type: 'CHANGE_DEPARTMENT' | 'RESET_ERROR';
    payload?: string;
}

function reducer(state: IState, action: IAction): IState{
    const {type, payload} = action;

    switch(type){
        case 'CHANGE_DEPARTMENT': {
            const newDepartment = payload;
            const hasError = newDepartment !== '카드메이커';

            return{
               ...state,
               department: hasError ? state.department : newDepartment,
               error: hasError ? '거부권 행사가능, 카드메이커만 입력 가능합니다 ' : null,
            };
        }
        case 'RESET_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}
export default function UseReducerCompany(){
    const [state, dispatch] = useReducer(reducer, {
        department: 'Software Developer',
        error: null,
    });

    const [error, setError] = useState<string | null>(null);

    const [department, setDepartment] = useState('');

    // const changeDepartment = ():Element=>{
    //     if(department !== '카드메이커'){
    //         setError('거부권 행사 가능');
    //     }
    //     else{
    //         setDepartment(department);
    //         setError(null);
    //     }
    // };


    const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>):void=>{
        setDepartment(e.target.value);
        if (state.error) {
            dispatch({ type: 'RESET_ERROR' });
        }
    };

    return(
        <div>
            <h1>{state.department}</h1>
            {state.error && <p className="text-red-500 font-2xl">{state.error}</p>}
        
        
            <input 
                className="w-[600px] border mt-10 p-4 rounded-md" 
                placeholder='변경하시고 싶은 직무를 입력해주세요. 단 거부권 행사 가능'
                value={department} 
                onChange={handleChangeDepartment}/>

            <button
              className="mt-6 rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
              onClick={():void => dispatch({type: 'CHANGE_DEPARTMENT' , payload: department})}
            >
              직무 변경하기
            </button>
        </div>
    )
}