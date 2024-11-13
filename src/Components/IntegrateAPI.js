import React, { useState, useEffect, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
export default function IntegrateAPI() {
  let emptyProduct = {
    availabilityStatus: "In Stock",
    brand: "",
    category: "",
    description: " ",
    dimensions: {},
    discountPercentage: 0,
    id: null,
    images: [],
    meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
    minimumOrderQuantity: 0,
    price: 0,
    rating: 0,
    returnPolicy: "",
    reviews: [],
    shippingInformation: "",
    sku: "",
    stock: 0,
    tags: [],
    thumbnail: "",
    title: "",
    warrantyInformation: "",
    weight: 0
  };
  const [products, setProducts] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [statuses] = useState(['In Stock', 'Low Stock', 'Out Of Stock']);
  const [modifiedRecords, setModifiedRecords] = useState({})
  const [deleteRows, setDeleteRows] = useState({})
  const productPeageLenth = useRef(0);
  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => { setProducts(data.products); productPeageLenth.current = data?.products.length })
      .catch(error => console.error("Error fatching Products:", error))

  }, []
  );

  console.log(products);
  console.log(productPeageLenth.current);
  console.log(editingRows)

  const representativeBodyTemplate = (rowData) => {
    let image = rowData.images;
    return (
      <div className="flex align-items-center gap-2">
        <img alt={rowData.category} src={image} className="shadow-2 border-round" style={{ width: '60px' }} />
      </div>
    );
  };
  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };
  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.availabilityStatus} severity={getSeverity(rowData.availabilityStatus)}></Tag>;
  };
  const getSeverity = (value) => {
    switch (value) {
      case 'In Stock':
        return 'success';

      case 'Low Stock':
        return 'warning';

      case 'Out Of Stock':
        return 'danger';

      default:
        return null;
    }
  };
  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
  };

  const newRecordsToAdd = async (rowData) => {
    debugger
    let _products = [...products]
    let index = _products.findIndex(e => e.id === rowData?.id);
    rowData.id = null;
    console.log('newrecordCall', 'id is null', rowData.id)
    await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          rowData
        }
      )
    })
      .then(res => res.json())
      .then(data => {
        _products[index] = { ...rowData, id: data?.id }
        setProducts(_products);
      })
  }
  const updateRecords = async (rowData) => {
    console.log('updatecall', rowData)
    debugger;
    await fetch(`https://dummyjson.com/products/${rowData.id}`, {
      method: 'PUT', /* or PATCH */
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rowData
      })
    })
      .then(res => res.json())
      .then(data => {
        let _products = [...products]
        let index = _products.findIndex(e => e.id === rowData?.id);
        _products[index] = data;
        setProducts(_products);
      })
  }
  const saveRecords = async () => {
    debugger;
    Object.keys(modifiedRecords).forEach(key => {
      const product = modifiedRecords[key];
      if (typeof (product.id) != 'number' && product?.id.includes("new")) {
        newRecordsToAdd(product);
      }
      else {
        updateRecords(product);
      }
    });
    setModifiedRecords({});
    Object.keys(deleteRows).forEach(key => {

      fetch(`https://dummyjson.com/products/${deleteRows[key].id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
    })
    setDeleteRows({});
  }
  const header = () => {
    return (
      <div className='flex flex-wrap gap-2'>
        <Button label='New' icon="pi pi-plus" style={{ width: '10%' }} severity="success" onClick={openNew}></Button>
        <Button label="Save" icon="pi pi-check" style={{ width: '10%', float: 'right' }} onClick={saveRecords} />
      </div>
    );
  }
  const onRowEditComplete = ({ newData, rowData }) => {
    let _products = [...products];
    let index = _products.findIndex(e => e.id === rowData?.id);
    _products[index] = newData;
    setProducts(_products);
    setEditingRows(prev => {
      const updated = { ...prev }
      delete updated[rowData?.id]
      return updated
    })
    setModifiedRecords(prev => {
      return {
        ...prev, [rowData?.id]: newData
      }
    })
  };

  // const newRow = { ...emptyProduct, id: "new" + products.length }
  // setProducts([...products, newRow])
  // setEditingRows(prev => {
  //   return {
  //     ...prev,
  //     [newRow.id]: newRow
  //   }
  // })
  const openNew = () => {
    const newRow = { ...emptyProduct, id: "new" + products.length }
    setProducts([...products, newRow])
    setEditingRows(prev => {
      return {
        ...prev,
        [newRow.id]: newRow
      }
    })
  }
  const cancelEditRow = (rowData) => {
    setEditingRows(prev => {
      const updated = { ...prev }
      delete updated[rowData?.id]
      return updated
    })
  };
  const editeRow = (rowData) => {
    setEditingRows(prev => {
      return {
        ...prev,
        [rowData?.id]: rowData
      }
    })
  };
  const deleteRow = (rowData) => {
    let _products = products.filter((val) => val.id !== rowData.id);
    setProducts(_products);
    setDeleteRows((prev) => {
      return {
        ...prev, [rowData.id]: rowData
      }
    })
  };
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
  const updateRow = (id, key, value) => {
    setEditingRows(prev => {
      const updated = { ...prev }
      updated[id] = { ...editingRows[id], [key]: value }
      return updated
    })
  }
  const textEditor = (options) => {
    const { rowData, field } = options
    const value = editingRows[rowData?.id]?.[field] ?? rowData?.[field]
    return <InputText type='text' value={value} onChange={(e) => updateRow(rowData.id, field, e.target.value)}></InputText>
  };
  const statusEditor = (options) => {
    const { rowData, field } = options
    const value = editingRows[rowData?.id]?.[field] ?? rowData?.[field]
    return (
      <Dropdown
        value={value}
        options={statuses}
        onChange={(e) => updateRow(rowData.id, field, e.value)}
        placeholder="Select a status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>
        }}
      >
      </Dropdown>
    )
  };
  const priceEditor = (options) => {
    const { rowData, field } = options
    const value = editingRows[rowData?.id]?.[field] ?? rowData?.[field]
    return <InputNumber value={value} mode="currency" currency="USD" locale="en-US" onValueChange={(e) => updateRow(rowData.id, field, e.value)}></InputNumber>
  }
  const imgEditor = (options) => {
    const rowData = options.rowData
    const value = editingRows[rowData?.id]?.images ?? rowData?.images
    return <FileUpload mode='Basic' name="demo[]" url={value} accept="image/*" maxFileSize={1000000} chooseLabel="upload image"></FileUpload> // <InputText type="file"></InputText>
  }
  const ratingEditor = (options) => {
    const { rowData, field } = options
    const value = editingRows[rowData?.id]?.[field] ?? rowData?.[field]
    return (
      <div>
        <Rating value={value} onChange={(e) => updateRow(rowData.id, field, e.target.value)}></Rating>
      </div>)
  }
  return (
    <div className="card">
      <DataTable value={products} header={header} editMode='row' editingRows={editingRows}
        onRowEditChange={(e) => setEditingRows(e.data)} dataKey="id" paginator
        rows={20} rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLlinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" scrollable scrollHeight="450px" tableStyle={{ minWidth: '50rem' }}>
        <Column field="title" header="Title" editor={(options) => textEditor(options)} sortable style={{ minWidth: "12rem" }}></Column>
        <Column field="description" header="Description" editor={(options) => textEditor(options)} style={{ minWidth: "14rem" }}></Column>
        <Column field="category" header="Category" editor={(options) => textEditor(options)} sortable style={{ minWidth: "10rem" }}></Column>
        <Column field="stock" header="Quantity" sortable ></Column>
        <Column field="price" header="Price" sortable body={priceBodyTemplate} editor={(options) => priceEditor(options)}></Column>
        <Column header='Image' style={{ minWidth: "10rem" }}
          body={representativeBodyTemplate} editor={(options) => imgEditor(options)} ></Column>
        <Column field="availabilityStatus" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ minWidth: '14rem' }}></Column>
        <Column field="rating" header="Reviews" body={ratingBodyTemplate} editor={(options) => { ratingEditor(options) }} style={{ minWidth: "12rem" }}></Column>
        <Column field='' body={actionBodyTemplate} style={{ minWidth: "10rem" }}></Column>
      </DataTable>
    </div>
  )

}

// let _modifiedRecords = [...modifiedRecords];
// _modifiedRecords[index] = emptyProduct
// setModifiedRecords(prev =>{
//   return{
//     ...prev,[ emptyProduct.id] : emptyProduct
//   }
// })
// let modifiedProduct = [...modifiedRecords]
// modifiedProduct[index] = newData
// setModifiedRecords(modifiedProduct)

// for (let key in Object.values(modifiedRecords)) {
//   if (key !== undefined && modifiedRecords[key] >= (productPeageLenth.current - 1)) {
//     newRecordsToAdd(modifiedRecords[key]);
//   } else if (key !== undefined) {
//     updateRecords(modifiedRecords[key])
//   }
// }


// const _products = [...products]
// const index = _products.length;
// emptyProduct.id = index + 1;
// _products[index] = emptyProduct;
// setProducts(_products);
// setEditingRows(prev => {
//   return {
//     ...prev,
//     [index]: emptyProduct
//   }
// })