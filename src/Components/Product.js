import React, { useEffect, useRef, useState } from "react";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
//import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
function Products() {
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
  const [productDialog, setProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [submitted, setSubmitted] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalfilter] = useState(null)
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data));
  }, []);

  const onCategoryChange = (e) => {
    let _product = { ...product };
    _product['category'] = e.value;
    setProduct(_product);
  }

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true)
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;
    if(name === 'quantity'){
      if(val === 0){
        _product.inventoryStatus = 'OUTOFSTOCK';
      }else if(val < 10){
        _product.inventoryStatus = 'LOWSTOCK';
      }else{
        _product.inventoryStatus = 'INSTOCK';
      }

    }
    setProduct(_product);
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };
  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const saveProduct = () => {
    setSubmitted(true);
    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);
        _products[index] = _product;
        toast.current.show({ severity: 'success', sunnary: "Successful", detail: "Product Updated", life: 3000 });
      } else {
        _product.id = createId();
        _product.image = 'product-placeholder.svg';
        _products.push(_product);
        toast.current.show({ severity: "success", summary: "Successful", detail: 'Product Created', life: 3000 });
      }
      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: "Successful", detail: "Product Deleted", life: 3000 });
  };

  const deleteSelectedProducts = ()=>{
    let _products =products.filter((val)=>!selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({severity:"success",summary:"Successful",detail:"Products Deleted",life:3000});
  };

  const productDialogFooter =(
    <React.Fragment>
      <Button label="Cancel" icon='pi pi-times' outlined onClick={hideDialog}></Button>
      <Button label="Save" icon="pi pi-check" onClick={saveProduct}></Button>
    </React.Fragment>
  );

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)} />
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: "currency", currency: "USD" });
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
  };

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return "danger";
      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Products</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search"></InputIcon>
        <InputText type="search" onInput={(e) => setGlobalfilter(e.target.value)} placeholder="Search..."></InputText>
      </IconField>
    </div>
  );

  const leftToolbarTemplate =  (
      <div className="flex flex-warp gap-2">
        <Button label='New' icon="pi pi-plus" severity="success" onClick={openNew}></Button>
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
      </div>
    );
  

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)}></Button>
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)}></Button>
      </React.Fragment>
    )
  };

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label='No' icon="pi pi-times" outlined onClick={hideDeleteProductDialog}></Button>
      <Button label="Yes" icon='pi pi-check' severity="danger" onClick={deleteProduct}></Button>
    </React.Fragment>
  );

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label='No' icon="pi pi-times" outlined onClick={hideDeleteProductsDialog}></Button>
      <Button label="Yes" icon='pi pi-check' severity="danger" onClick={deleteSelectedProducts}></Button>
    </React.Fragment>
  );

  return (
    <>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)} dataKey="id" paginator
          rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLlinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header} scrollable scrollHeight="450px" style={{ minWidth: '50rem' }} >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="code" header="Code" sortable style={{ minWidth: "12rem" }}></Column>
          <Column field="name" header="Name" sortable style={{ minWidth: "16rem" }}></Column>
          <Column field="image" header="Image" body={imageBodyTemplate}></Column>
          <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: "8rem" }}></Column>
          <Column field="category" header="Category" sortable style={{ minWidth: "10rem" }}></Column>
          <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: "12rem" }}></Column>
          <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "12rem" }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: "12rem" }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '80vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid"
        footer={productDialogFooter} onHide={hideDialog}>
        {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3"></img>}

        <div className="field">
          <label htmlFor="name" className="font-bold">Name</label>
          <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })}></InputText>
          {submitted && !product.name && <small className="p-error">Name is required</small>}
        </div>

        <div className="field">
          <label htmlFor="description" className="font-bold">Description</label>
          <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20}></InputTextarea>
        </div>

        <div className="field">
          <label className="mb-3 font-bold"> Category</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === "Accessories"}></RadioButton>
              <label htmlFor="categor1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === "Clothing"}></RadioButton>
              <label htmlFor="categor2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === "Electronics"}></RadioButton>
              <label htmlFor="categor3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === "Fitness"}></RadioButton>
              <label htmlFor="categor1">Fitness</label>
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price" className="font-bold">Price</label>
            <InputNumber id='price' value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode='currency' currency="USD" locale="en-US"></InputNumber>
          </div>

          <div className="field col">
            <label htmlFor="quantity" className="font-bold">Quantity</label>
            <InputNumber id='quantity' value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} ></InputNumber>
          </div>
        </div>
      </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', "641px": '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }}></i>
          {product && <spam>Are you sure you want to delete the product?</spam>}
        </div>
      </Dialog>

      <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', "641px": '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }}></i>
          {product && <spam>Are you sure you want to delete the selected product?</spam>}
        </div>
      </Dialog>
    </>
  );
}

export default Products;
