
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { ProductService } from '../service/ProductService';
import { AutoComplete } from 'primereact/autocomplete';
export default function RowEditingProduct() {
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
    const [values] = useState(['good','bad','excellent']);
    const [items, setItems] = useState([]);
    const [product , setProduct] = useState(emptyProduct)
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

    const onRowEditComplete = (e) => {
        let _products = [...products];
        let { newData, index } = e;

        _products[index] = newData;

        setProducts(_products);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };
    const productddlChange =(o,data) =>{
        o.editorCallback(data);
        let _product = products?.map(item => {
            if(item.name === data){
                o.rowData.code= item.code
                o.rowData.inventoryStatus = item.inventoryStatus
                o.rowData.price = item.price
        } });
    }
    const productNameEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={productList}
                onChange={(e) => productddlChange(options,e.value)}
             //   onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Product"
                // itemTemplate={(option) => {
                //     return <Tag value={option} severity={getSeverity(option)}></Tag>;
                // }}
            />
        );
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
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

    const productDescriptionEditor = (options)=>{
        return <AutoComplete value={options.value} delay={350} suggestions={items} completeMethod={search} onChange={(e) => options.editorCallback(e.target.value)} />
    };

    const search = (event) => {
        setItems([...values].map(item => event.query + '-' + item));
    }

    return (
        <div className="card p-fluid">
            <DataTable value={products} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="code" header="Code" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="name" header="Name" editor={(options) => productNameEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column>
                <Column field = 'description' header="ProductDescription" editor={(options) => productDescriptionEditor(options)} style={{ minWidth: "10rem" }}></Column>  
                <Column  rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    );
}
        // body ={productDescriptionTemplate}    editor={(options) => productDescriptionEditor(options)}  rowEditor={allowEdit}