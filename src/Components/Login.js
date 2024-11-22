import React, { useState } from 'react'
import { useAuth } from './AuthProvider';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
const Login = (p) => {
    const [input, setInput] = useState({ Email: '', password: '' })
    const auth = useAuth();
    const handleSubmitEvent = (e)=>{
        e.preventDefault();
        if(input.userName!== "" && input.password!== ""){
           auth.loginAction(input)
        }
    }
    const handleInput =(e) =>{
       const {name,value} = e.target;
       setInput((prev)=>({
        ...prev, [name]:value,
       }))
    }
    return (
        <div>
            <form onSubmit={handleSubmitEvent}>
                <div  className='flex flex-wrap gap-2'>
                <FloatLabel>
                    <InputText id="username" name='Email' value={input.userName} onChange={handleInput} />
                    <label htmlFor="username">Username</label>
                </FloatLabel>
                <FloatLabel>
                    <Password id='password' name='password' value={input.password} onChange={handleInput} toggleMask />
                    <label htmlFor="password">Password</label>
                </FloatLabel>
                <Button label="Login"/>
                </div>
            </form>
        </div>
    )
}

export default Login;