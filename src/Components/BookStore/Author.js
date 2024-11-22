import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";

const Author = () => {
  const [authors, setAuthors] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [modifiedRecords, setModifiedRecords] = useState({})
  const [saveAuthors, setSaveAuthors] = useState(false);
  const [deleteAuthors, setDeleteAuthors] = useState({})
  useEffect(
    () => {
      const response = fetch("https://localhost:7095/api/Authors", {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(data => { setAuthors(data); })
        .catch(error => console.error("Error fatching Authors:", error));
    }, []
  );
  const emptyProduct = {
    id: '',
    fristName: "",
    lastName: "",
    bio: ""
  };

  const header = () => {
    return (
      <div className='flex flex-wrap gap-2'>
        <Button label='New' icon="pi pi-plus" style={{ width: '10%' }} severity="success" onClick={openNewRecord}></Button>
        <Button label="Save" icon="pi pi-check" style={{ width: '10%', float: 'right' }} onClick={saveRecords} />
      </div>
    );
  };

  const openNewRecord = () => {
    const newRow = { ...emptyProduct, id: 'new' + authors.length }
    setAuthors([...authors, newRow]);
    setEditingRows(prev => {
      return {
        ...prev, [newRow.id]: newRow
      }
    })
  };

  const saveRecords = () => {
    debugger
    Object.keys(modifiedRecords).forEach((key)=>{
      let _author = modifiedRecords[key];
      if(typeof(_author.id)!== 'number' && _author.id.includes("new")){
          newAuthorToAdd(_author);
      }else{
        updatedAuthor(_author)
      }

    })
    setModifiedRecords({});
  };
  const newAuthorToAdd = async (val)=>{
    const response = await fetch("https://localhost:7095/api/Authors",{
      method:"POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
       ...val
      })
    });

    const  data = await response.json();
    if(data){
      let _author= [...authors]
      let index = _author.findIndex(e => e.id === val.id);
    _author[index] = data;
    setAuthors(_author);
    }
  };

  const updatedAuthor = async(val) =>{
    debugger
    let id = val.id
    const response = await fetch(`https://localhost:7095/api/Authors/${id}`,{
      method:"PUT",
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
      ...val
      })
    });

    let  data ;// await response.json();
    if(data){
      let _author= [...authors]
      let index = _author.findIndex(e => e.id === val.id);
    _author[index] = data;
    setAuthors(_author);
    }
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        {
          editingRows[rowData?.id] ?
            <>
              <Button icon='pi pi-check' rounded outlined className="mr-2" onClick={() => onRowEditComplete({ newData: editingRows[rowData?.id], rowData })}></Button>
              <Button icon='pi pi-times' rounded outlined className="mr-2" onClick={() => cancelEditRow(rowData)}></Button>
            </>
            :
            <>
              <Button icon='pi pi-pencil' round outlined className="mr-2" onClick={() => editeRow(rowData)}></Button>
              <Button icon='pi pi-trash' rounded outlined className="mr-2" severity="danger" onClick={() => deleteRow(rowData)}></Button>
            </>
        }
      </div>
    )
  };
  const onRowEditComplete = ({ newData, rowData }) => {
    let _author = [...authors];
    let index = _author.findIndex(e => e.id === rowData.id);
    _author[index] = newData;
    setAuthors(_author);
    setEditingRows(prev => {
      const upated = { ...prev };
      delete upated[newData.id]
      return upated;
    });
    setModifiedRecords(prev => {
      return {
        ...prev, [rowData.id]: newData
      }
    })
  };
  const cancelEditRow = (rowData) => {
    setEditingRows(prev => {
      const upated = { ...prev };
      delete upated[rowData.id]
      return upated;
    });
  };
  const editeRow = (rowData) => {
    setEditingRows(prev => {
      return {
        ...prev, [rowData.id]: rowData
      }
    })

  };

  const deleteRow = (rowData) => {
    if (typeof (rowData.id) != 'string') {
      setDeleteAuthors(prev => {
        return {
          ...prev, [rowData.id]: rowData
        }
      })
    }
    let _author = authors.filter((val)=> val.id !== rowData.id);
    setAuthors(_author);

  };

  const textEditor = (options) => {
    const { rowData, field } = options
    const value = editingRows[rowData?.id]?.[field] ?? rowData?.[field]
    return <InputText type='text' value={value} onChange={(e) => updateValue(rowData.id, field, e.target.value)}></InputText>
  };

  const updateValue = (id, key, value) => {
    setEditingRows((prev) => {
      const updated = { ...prev }
      updated[id] = { ...editingRows[id], [key]: value };
      return updated;
    });

  };

  return (
    <div className="card">
      <DataTable value={authors} header={header} editMode='row' editingRows={editingRows}
        onRowEditChange={(e) => setEditingRows(e.data)} dataKey="id">
        <Column field='fristName' header='FirstName' editor={(options) => textEditor(options)}></Column>
        <Column field='lastName' header='LastName' editor={(options) => textEditor(options)}></Column>
        <Column field='bio' header='Bio' editor={(options) => textEditor(options)}></Column>
        <Column field='' body={actionBodyTemplate}></Column>
      </DataTable>
    </div>
  )
}

export default Author