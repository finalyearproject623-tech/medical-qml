import { useState, useEffect } from "react";
import API from "../api/api";

const featureGuide = {
  age: "Age of patient (29–77)",
  sex: "0 = Female, 1 = Male",
  cp: "Chest Pain Type (0–3)",
  trestbps: "Resting Blood Pressure (94–200)",
  chol: "Serum Cholesterol (126–564)",
  fbs: "Fasting Blood Sugar (0 ≤120, 1 >120)",
  restecg: "ECG result (0–2)",
  thalch: "Maximum Heart Rate (71–202)",
  exang: "Exercise Induced Angina (0 No, 1 Yes)",
  oldpeak: "ST Depression (0–6.2)",
  slope: "Slope of ST segment (0–2)",
  ca: "Major Vessels (0–4)",
  thal: "Thalassemia (0 Normal,1 Fixed,2 Reversible)"
};

const featureRange = {
  age:[29,77],
  sex:[0,1],
  cp:[0,3],
  trestbps:[94,200],
  chol:[126,564],
  fbs:[0,1],
  restecg:[0,2],
  thalch:[71,202],
  exang:[0,1],
  oldpeak:[0,6.2],
  slope:[0,2],
  ca:[0,4],
  thal:[0,2]
};

const heartExample = {
  age:63, sex:1, cp:3, trestbps:145, chol:233,
  fbs:1, restecg:0, thalch:150, exang:0,
  oldpeak:2.3, slope:0, ca:0, thal:1
};

const normalExample = {
  age:45, sex:0, cp:1, trestbps:120, chol:200,
  fbs:0, restecg:0, thalch:170, exang:0,
  oldpeak:0.2, slope:2, ca:0, thal:2
};

const Predict = ({ setIsLoggedIn }) => {

const [form,setForm] = useState({
  age:55,sex:1,cp:2,trestbps:130,chol:245,
  fbs:0,restecg:1,thalch:150,exang:0,
  oldpeak:1.2,slope:2,ca:0,thal:2
});

const [result,setResult] = useState(null);
const [history,setHistory] = useState([]);
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const [showGuide,setShowGuide] = useState(false);
const [toggleExample,setToggleExample] = useState(true);

const fetchHistory = async () => {
  try{
    const res = await API.get("/history");
    setHistory(res.data.reverse());
  }catch{
    setHistory([]);
  }
};

useEffect(()=>{
  fetchHistory();
},[]);

const handleChange = (key,value)=>{
  setForm({...form,[key]:value});
};

const handleExample = ()=>{
  if(toggleExample){
    setForm(heartExample);
  }else{
    setForm(normalExample);
  }
  setToggleExample(!toggleExample);
};

const handlePredict = async ()=>{

  try{

    setLoading(true);
    setError("");

    const res = await API.post("/predict",form);

    setResult(res.data);

    await fetchHistory();

  }catch(err){

    if(err.response?.status === 401){
      localStorage.clear();
      setIsLoggedIn(false);
    }

    setError("Prediction failed. Please login again.");

  }finally{
    setLoading(false);
  }

};

const handleLogout = ()=>{
  localStorage.clear();
  setIsLoggedIn(false);
};

const getResultColor = (prediction)=>{
  return prediction==="Heart Disease"
  ?"bg-red-50 border-red-200 text-red-700"
  :"bg-green-50 border-green-200 text-green-700";
};

/* ---------- Risk Gauge Component ---------- */

const RiskGauge = ({confidence})=>{

const percent = confidence*100;

let color="bg-green-500";

if(percent>70) color="bg-red-500";
else if(percent>40) color="bg-yellow-500";

return(

<div className="w-full mt-6">

<div className="flex justify-between text-xs mb-1">
<span className="text-green-600 font-semibold">Low</span>
<span className="text-yellow-600 font-semibold">Medium</span>
<span className="text-red-600 font-semibold">High</span>
</div>

<div className="w-full bg-gray-200 rounded-full h-5 relative">

<div
className={`${color} h-5 rounded-full`}
style={{width:`${percent}%`}}
></div>

<div
className="absolute top-0 bottom-0 w-1 bg-black"
style={{left:`${percent}%`}}
></div>

</div>

<p className="text-center mt-2 text-sm font-semibold">
Risk Level: {percent.toFixed(1)}%
</p>

</div>

);

};

return(

<div className="min-h-screen bg-gray-50 flex">

{/* Sidebar */}

<div className="w-64 bg-white shadow-xl p-6 hidden md:block">

<h2 className="text-2xl font-bold text-purple-600 mb-10">
Medical Hybrid QML
</h2>

<button
onClick={handleLogout}
className="text-red-500 font-medium hover:underline"
>
Logout
</button>

</div>

{/* Main */}

<div className="flex-1 p-8">

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold text-gray-800">
Hybrid Prediction Dashboard
</h1>

<div className="flex gap-3">

<button
onClick={handleExample}
className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
Example Values
</button>

<button
onClick={()=>setShowGuide(true)}
className="bg-purple-600 text-white px-4 py-2 rounded-lg"
>
Guidelines
</button>

</div>

</div>

{/* Form */}

<div className="bg-white p-8 rounded-3xl shadow-lg mb-8">

<h3 className="text-xl font-semibold mb-6">
Enter Patient Details
</h3>

<div className="grid grid-cols-2 md:grid-cols-3 gap-6">

{Object.keys(form).map((key)=>(

<div key={key}>

<label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
{key}
</label>

<input
type="number"
min={featureRange[key][0]}
max={featureRange[key][1]}
step={key==="oldpeak"?"0.1":"1"}
value={form[key]}
onChange={(e)=>{

let value = Number(e.target.value);

const min = featureRange[key][0];
const max = featureRange[key][1];

if(value<min) value=min;
if(value>max) value=max;

handleChange(key,value);

}}
className="w-full border border-gray-300 rounded-xl p-3"
/>

</div>

))}

</div>

<button
onClick={handlePredict}
disabled={loading}
className={`mt-8 w-full py-4 rounded-xl text-white font-semibold ${
loading?"bg-purple-300":"bg-purple-600 hover:bg-purple-700"
}`}
>
{loading?"Running Hybrid Prediction...":"Run Hybrid Prediction"}
</button>

{error && (
<p className="text-red-600 text-center mt-4">
{error}
</p>
)}

</div>

{/* RESULT */}

{result && (

<div className={`p-8 rounded-3xl shadow-lg border mb-8 ${getResultColor(result.final_prediction)}`}>

<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
Final Hybrid Result
</h2>

<p className="text-2xl font-semibold">
{result.final_prediction}
</p>

<p className="mt-2">
Final Confidence: {(result.final_confidence*100).toFixed(2)}%
</p>

<RiskGauge confidence={result.final_confidence}/>

<div className="mt-6 grid md:grid-cols-2 gap-6 text-sm">

<div>

<p className="font-semibold text-purple-600">
⚛️ Quantum Confidence
</p>

<p>{(result.quantum_confidence*100).toFixed(2)}%</p>

</div>

<div>

<p className="font-semibold text-blue-600">
🧠 Classical Confidence
</p>

<p>{(result.classical_confidence*100).toFixed(2)}%</p>

</div>

</div>

</div>

)}

{/* HISTORY */}

<div className="bg-white p-8 rounded-3xl shadow-lg">

<h3 className="text-xl font-semibold mb-6">
Prediction History
</h3>

{history.length===0?(
<p className="text-gray-500">No predictions found.</p>
):( 

<div className="space-y-4">

{history.map((item,index)=>(

<div
key={index}
className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition"
>

<div className="flex justify-between items-center">

<p className="font-semibold text-lg">
🔥 {item.final_prediction}
</p>

<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
item.final_prediction==="Heart Disease"
?"bg-red-100 text-red-600"
:"bg-green-100 text-green-600"
}`}>
{item.final_prediction==="Heart Disease"?"High Risk":"Low Risk"}
</span>

</div>

<p className="text-sm text-gray-600 mt-2">
Final Confidence {(item.final_confidence*100).toFixed(2)}%
</p>

<div className="mt-4 space-y-3">

<div>

<p className="text-xs text-purple-600 font-semibold">
Quantum Model
</p>

<div className="w-full bg-gray-200 rounded-full h-2">

<div
className="bg-purple-600 h-2 rounded-full"
style={{width:`${item.quantum_confidence*100}%`}}
></div>

</div>

</div>

<div>

<p className="text-xs text-blue-600 font-semibold">
Classical Model
</p>

<div className="w-full bg-gray-200 rounded-full h-2">

<div
className="bg-blue-600 h-2 rounded-full"
style={{width:`${item.classical_confidence*100}%`}}
></div>

</div>

</div>

</div>

<p className="text-xs text-gray-400 mt-4">
{new Date(item.created_at).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}
</p>

</div>

))}

</div>

)}

</div>

</div>

{/* GUIDELINES MODAL */}

{showGuide && (

<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

<div className="bg-white p-8 rounded-2xl w-[700px] max-h-[80vh] overflow-y-auto">

<div className="flex justify-between mb-6">

<h2 className="text-xl font-bold text-purple-600">
Dataset Guidelines
</h2>

<button
onClick={()=>setShowGuide(false)}
className="text-red-500 font-bold"
>
X
</button>

</div>

<table className="w-full text-sm border">

<thead className="bg-gray-100">
<tr>
<th className="border p-2">Feature</th>
<th className="border p-2">Meaning</th>
</tr>
</thead>

<tbody>

{Object.keys(featureGuide).map((key)=>(

<tr key={key}>
<td className="border p-2">{key}</td>
<td className="border p-2">{featureGuide[key]}</td>
</tr>

))}

</tbody>

</table>

</div>

</div>

)}

</div>

);

};

export default Predict;