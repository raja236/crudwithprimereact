import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { replace, useNavigate, useParams,Navigate } from 'react-router-dom';
const Individualproduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${parseInt(id)}`)
            .then(res => res.json())
            .then(data => setProduct([data]));
    }, []
    );

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
    const previousPage = () => {
        navigate(-1);
       // navigate("fetchProducts", {replace :true} );
      //<Navigate to="/dashboard/fetchProducts" replace />
    }
    const header = () => {
        return (
            <div className='flex flex-wrap gap-2'>
                <h3 style={{ width: '10%', float: 'left' }}>Product: </h3>
                <Button label="Back" style={{ width: '10%', float: 'right' }} onClick={previousPage} />
            </div>
        );
    }
    return (
        <div>
            <DataTable value={product} header={header} scrollable scrollHeight="450px" tableStyle={{ minWidth: '50rem' }}>
                <Column field="title" header="Title" style={{ minWidth: "12rem" }}></Column>
                <Column field="description" header="Description" style={{ minWidth: "14rem" }}></Column>
                <Column field="category" header="Category" style={{ minWidth: "10rem" }}></Column>
                <Column field="stock" header="Quantity" sortable ></Column>
                <Column field="price" header="Price" sortable body={priceBodyTemplate}></Column>
                <Column header='Image' style={{ minWidth: "10rem" }}
                    body={representativeBodyTemplate}  ></Column>
                <Column field="availabilityStatus" header="Status" body={statusBodyTemplate} style={{ minWidth: '14rem' }}></Column>
                <Column field="rating" header="Reviews" body={ratingBodyTemplate} style={{ minWidth: "12rem" }}></Column>
            </DataTable>
        </div>
    )
}

export default Individualproduct;