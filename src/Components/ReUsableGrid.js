import React ,{useState}from 'react'
import RowEditingProduct from './RowEditProduct';
import { Button } from 'primereact/button';
const ReUsableGrid = () => {
  const [data, setData] = useState({})
  const allModifiedRecord  =(gridId,data)=>{
    setData(prev =>{
      // return{
      //   ...prev,[gridId]:data
      // }

      return {
        ...prev,[gridId]:{
          ...prev[gridId],[data.id]:data
        }
      }
    })
  }
  return (
    <div>
      <Button label='Save' style={{ width: '10%', float:'right' }}  onClick={()=> console.log(data)}></Button>
      <RowEditingProduct gridname='gridOne' modifiedData = {allModifiedRecord}/>
      <RowEditingProduct gridname ='gridTwo' modifiedData = {allModifiedRecord}/>
      <RowEditingProduct gridname='gridThree' modifiedData = {allModifiedRecord}/>
    </div>
  )
}

export default ReUsableGrid;