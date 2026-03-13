import { useState } from "react";
import { signupUser } from "../api/auth";

const Signup = ({ switchToLogin, switchToVerify }) => {

const [form,setForm] = useState({
email:"",
password:"",
confirmPassword:""
});

const [error,setError] = useState("");
const [message,setMessage] = useState("");

const handleSubmit = async(e)=>{
e.preventDefault();

if(form.password !== form.confirmPassword){
setError("Passwords do not match");
return;
}

try{

const res = await signupUser({
email:form.email,
password:form.password
});

setMessage(res.message);

setTimeout(()=>{
switchToVerify(form.email);
},1200);

}catch(err){
setError("Signup failed");
}

};

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600">

<div className="bg-white/20 p-10 rounded-3xl w-96 backdrop-blur-lg">

<h2 className="text-3xl text-white text-center mb-6">
Signup
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="email"
autoComplete="email"
required
placeholder="Email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
className="w-full p-3 rounded-xl"
/>

<input
type="password"
autoComplete="new-password"
required
placeholder="Password"
value={form.password}
onChange={(e)=>setForm({...form,password:e.target.value})}
className="w-full p-3 rounded-xl"
/>

<input
type="password"
autoComplete="new-password"
required
placeholder="Confirm Password"
value={form.confirmPassword}
onChange={(e)=>setForm({...form,confirmPassword:e.target.value})}
className="w-full p-3 rounded-xl"
/>

<button type="submit" className="w-full bg-white text-green-600 py-3 rounded-xl">
Signup
</button>

</form>

</div>

</div>

);

};

export default Signup;