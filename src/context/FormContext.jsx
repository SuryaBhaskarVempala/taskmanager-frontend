import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { userContext } from "./userContext";

export const formContext = createContext();

export function FormContextProvider({ children }) {

    const {user} = useContext(userContext);

    const [formData, setFormData] = useState({
        task: '',
        dueDate: new Date(),
        status: '',
        priority: '',
        createdBy: ''
    });
    const [submitData, setSubmitData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("FormContext : "+user.username);
                const response = await axios.get('http://localhost:3000/tasks/'+user._id.toString());
                console.log(response.data)
                setSubmitData(response.data); 
            } catch (err) {
                console.error(err);
                alert("Server Error. Please try again after some time.");
                setSubmitData([]); 
            }
        };

        fetchData(); 
        console.log("--------Called--------");

    }, []);

    const [rowId, setRowId] = useState('');

    const [errors, setErrors] = useState({});
    const [popup, setPopup] = useState(false);

    const context = {
        formData,
        setFormData,
        errors,
        setErrors,
        submitData,
        setSubmitData,
        popup,
        setPopup,
        rowId,
        setRowId
    };

    return (
        <div className="App">
            <formContext.Provider value={context}>
                {children}
            </formContext.Provider>
        </div>
    );
}
