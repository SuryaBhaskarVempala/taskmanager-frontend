import { useState } from "react";

export default function useFilter(dataList){
    const [query,setQuery] = useState({
        status:'',
        priority:''
    });
    
    const filteredData = dataList.filter((data)=> data.status.toLowerCase().includes(query.status) && data.priority.toLowerCase().includes(query.priority) );

    return [filteredData,setQuery];

}