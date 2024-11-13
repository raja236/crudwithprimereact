import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { CustomerService } from '../service/CustomerService';
const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    representative: { value: null, matchMode: FilterMatchMode.In },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [representatives] = useState([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
  ]);
  const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data) => setCustomers(getCustomers(data)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);

      return d;
    });
  };
  const onGlobalFilterChange = (e) => {
    let value = e.target.value;
    let _filter = { ...filters };
    _filter['global'].value = value;
    setFilters(_filter);
    setGlobalFilterValue(value);
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <div className='flex align-items-center gap-2'>
        <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
        <span>{rowData.country.name}</span>
      </div>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    let representative = rowData.representative;
    return (
      <div className="flex align-items-center gap-2">
        <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
        <span>{representative.name}</span>
      </div>
    );
  };

  const represantativeFilterTemplate = (options) => {
    return (
      <React.Fragment>
        <div className='mb-3 font-bold'>Agent Picker</div>
        <MultiSelect value={options.value} options={representatives} itemTemplate={representativeItemTemplate} onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name" placeholder='Any' className='p-column-filter'></MultiSelect>
      </React.Fragment>
    );
  };

  const representativeItemTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
        <span>{option.name}</span>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className='flex flex-wrap gap-2 justify-content-between align-items-center'>
        <h4 className='m-0'>Customers</h4>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"></InputIcon>
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} plaseholder="Keyword Search"></InputText>
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  const formatDate = (value) => {
    return value?.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: "numeric"
    });
  };

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.date);
  };

  const dateFilterTemplate = (options) => {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
  };

  const balanceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.balance);
  };

  const balanceFilterTemplate = (options) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const statusFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
  };
  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };
  const getSeverity = (status) => {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  };

  const activityBodyTemplate = (rowData) => {
    return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '6px' }}></ProgressBar>;
  };
  const activityFilterTemplate = (options) => {
    return (
      <>
        <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
        <div className="flex align-items-center justify-content-between px-2">
          <span>{options.value ? options.value[0] : 0}</span>
          <span>{options.value ? options.value[1] : 100}</span>
        </div>
      </>
    );
  };
  const actionBodyTemplate = () => {
    return <Button type="button" icon="pi pi-cog" rounded></Button>;
  };

  return (

    <div className='card'>
      <DataTable value={customers} paginator header={header} rows={10} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]} dataKey="id" selectionMode="checkbox" selection={selectedCustomers} onSelectionChange={(e) => setSelectedCustomers(e.value)} filters={filters}
        filterDelay="menu" globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']} emptyMessage="No customer found. "
        currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries' scrollable scrollHeight="450px" style={{ minWidth: '50rem' }} >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field='name' header='Name' sortable filter filterPlaceholder='Search by name' style={{ minWidth: '14rem' }}></Column>
        <Column field='country.name' header='Country' sortable filteraField="country.name" style={{ minWidth: "14rem" }} body={countryBodyTemplate} filter filterPlaceholder='Searrch by country'></Column>
        <Column header='Agent' sortable sortField='representative.name' filterField='representative' showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: "14rem" }}
          body={representativeBodyTemplate} filter filterElement={represantativeFilterTemplate}></Column>
        <Column field='date' header='Date' sortable filterField='date' dataType='date' style={{ minWidth: '12rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate}></Column>
        <Column field='balance' header='Balance' sortable dataType='numeric' style={{ minWidth: '12rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate}></Column>
        <Column field='status' header='Status' sortable filterMenuStyle={{ width: '14rem' }} style={{ width: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate}></Column>
        <Column field="activity" header="Activity" sortable showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
        <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
      </DataTable>
    </div>
  )
}

export default Customer