import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { ProductService } from '../service/ProductService';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
export default function RowEditingProduct({ gridname,modifiedData : changedData }) {
    let emptyProduct = {
        id: null,
        code: '',
        name: '',
        description: '',
        image: '',
        price: 0,
        category: '',
        quantity: 0,
        inventoryStatus: 'INSTOCK',
        rating: 0
    };
    const [products, setProducts] = useState(null);
    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);
    const [values] = useState(['good', 'bad', 'excellent']);
    const [items, setItems] = useState([]);
    const [editingRows, setEditingRows] = useState({})
    useEffect(() => {
        ProductService.getProductsMini().then((data) => setProducts(data));
    }, []);
    const productList = products ? products.map(item => item.name) : '';

    const getSeverity = (value) => {
        switch (value) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const onRowEditComplete = ({ newData, rowData }) => {
        if (gridname !== undefined && gridname === 'gridOne') {
           if(newData.code !== ''&&  newData.name !== ''){
                onRowEditCompleteCall(newData, rowData);
                changedData(gridname,newData);
           }else{
            alert('code and name are required')
            
           }
        } 
       else if (gridname !== undefined && gridname === 'gridTwo') {
            if(newData.price !== null &&  newData.description !== ''){
                onRowEditCompleteCall(newData, rowData);
                changedData(gridname,newData);
            }else{
           
             alert('price and description are required')
            }
         }
         else if (gridname !== undefined && gridname === 'gridThree') {
            if(newData.code !== ''&&  newData.name !== ''&& newData.price !== null &&  newData.description !== ''){
                onRowEditCompleteCall(newData, rowData);
             changedData(gridname,newData);
            }else{
             alert('all fields are required')
            }
         }
        else {
            onRowEditCompleteCall(newData, rowData);
        }
    };
    const onRowEditCompleteCall =(newData, rowData)=>{
        let _products = [...products];
        let index = _products.findIndex(e => e.id == rowData?.id);
        _products[index] = newData;
        setProducts(_products);
        setEditingRows(prev => {
            const updated = { ...prev }
            delete updated[rowData?.id]
            return updated
        })
    }

    const textEditor = (options) => {
        const { rowData } = options
        const value = editingRows[rowData?.id]?.code ?? rowData?.code
        return <InputText type="text" value={value} onChange={(e) => updateRow(options.rowData?.id, "code", e.target.value)} />;
    };
    const updateRow = (id, key, value) => {
        setEditingRows(prev => {
            const updated = { ...prev }
            updated[id] = { ...editingRows[id], [key]: value }
            return updated
        })
    }
    const productNameEditor = (options) => {
        const { rowData } = options
        const value = editingRows[rowData?.id]?.name ?? rowData?.name

        return (
            <Dropdown
                value={value}
                options={productList}
                onChange={(e) => updateRow(rowData?.id, "name", e.value)}
                placeholder="Select a Product"

            />
        );
    };

    const statusEditor = (options) => {
        const { rowData } = options
        const value = editingRows[rowData?.id]?.inventoryStatus ?? rowData?.inventoryStatus
        return (
            <Dropdown
                value={value}
                options={statuses}
                onChange={(e) => updateRow(options.rowData?.id, "inventoryStatus", e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const priceEditor = (options) => {
        const { rowData } = options
        const value = editingRows[rowData?.id]?.price ?? rowData?.price
        return <InputNumber value={value} onValueChange={(e) => updateRow(options.rowData?.id, "price", e.value)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)}></Tag>;
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    const allowEdit = (rowData) => {
        return rowData.name !== '';
    };

    const productDescriptionEditor = (options) => {
        const { rowData } = options
        const value = editingRows[rowData?.id]?.description ?? rowData?.description
        return <AutoComplete value={value} delay={350} suggestions={items} completeMethod={search} onChange={(e) => updateRow(options.rowData?.id, "description", e.target.value)} />
    };

    const search = (event) => {
        setItems([...values].map(item => event.query + '-' + item));
    }
    const editRow = (rowData) => {
        setEditingRows(prev => {
            return {
                ...prev,
                [rowData.id]: rowData
            }
        })
    }
    const cancelEditRow = (rowData) => {
        setEditingRows(prev => {
            const updated = { ...prev }
            delete updated[rowData?.id]
            return updated
        })
    }

    const deleteRow = (rowData) => {
        let _products = products.filter((val) => val.id !== rowData.id);
        setProducts(_products);
    };

    const actionsbodyTemplate = (rowData) => {
        return (
            <div>
                {
                    editingRows[rowData?.id] ?
                        <>
                            <Button icon="pi pi-check" rounded outlined className="mr-2" onClick={() => onRowEditComplete({ newData: editingRows[rowData?.id], rowData })}></Button>
                            <Button icon="pi pi-times" rounded outlined className="mr-2" onClick={() => cancelEditRow(rowData)}></Button>
                        </>

                        :
                        <>
                            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRow(rowData)}></Button>
                            <Button icon="pi pi-trash" rounded outlined className="mr-2" severity="danger" onClick={() => deleteRow(rowData)}></Button>
                        </>
                }
            </div>
        )


    };
    const openNew = () => {
        let _products = [...products];
        let index = _products.length;
        emptyProduct.id = (parseInt(_products[index - 1].id) + 1).toString();
        emptyProduct.name = 'XXXXXX'
        _products[index] = emptyProduct;
        setProducts(_products);
        setEditingRows(prev => {
            return {
                ...prev,
                [emptyProduct.id]: emptyProduct
            }
        })
    }
    // const leftToolbarTemplate =  (
    //     <div className="flex flex-warp gap-2">
    //       <Button label='New' icon="pi pi-plus" severity="success" onClick={openNew}></Button>
    //     </div>
    //   );

    const renderHeader = () => {
        return (
            <div className='flex flex-wrap gap-2'>
                <Button label='New' icon="pi pi-plus" style={{ width: '10%' }} severity="success" onClick={openNew}></Button>
            </div>
        );
    };

    const header = renderHeader();
    return (
        <div className="card p-fluid">
            {/* <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar> */}
            <DataTable
                value={products} header={header} editMode="row" dataKey="id" tableStyle={{ minWidth: '50rem' }}
                editingRows={editingRows}
                onRowEditChange={(e) => {
                    setEditingRows(e.data)
                }}
                scrollable scrollHeight="450px" style={{ minWidth: '50rem' }}
            >
                <Column field="code" header="Code" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="name" header="Name" editor={(options) => productNameEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column>
                <Column field='description' header="ProductDescription" editor={(options) => productDescriptionEditor(options)} style={{ minWidth: "10rem" }}></Column>
                <Column field='' body={actionsbodyTemplate} style={{ minWidth: "10rem" }}></Column>

                {/* <Column  rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
            </DataTable>
        </div>
    );
}
// body ={productDescriptionTemplate}    editor={(options) => productDescriptionEditor(options)}  rowEditor={allowEdit}  (e) => options.editorCallback(e.target.value)