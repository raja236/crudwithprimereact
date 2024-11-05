import React, { useState } from 'react'
import { PanelMenu } from "primereact/panelmenu";
import { Link, Outlet } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar'; 
export default function Layout() {
    const [expandedKeys, setExpandedKeys] = useState({
        0: true,
        1: true,
        2: true,
    })
    const nodeTemplate =(item) =>{
        const expanded = expandedKeys[item.key]
        return(
            <Link to = {item.url}></Link>
        )
    }
    const navigate = useNavigate();
    const items = [
        {
            key: "0",
            label: 'Product and Customer',
            icon: 'pi pi-palette',
           // template: nodeTemplate,
            items: [
                {
                    key: "1-0",
                    label: 'Customers',
                    icon: 'pi pi-user',
                   // url: '/Customer',
                   // template: nodeTemplate,
                    command: () => {
                        navigate('/Customer');
                    }
                },
                {
                    key: "2-0",
                    label: 'Products',
                    icon: 'pi pi-heart',
                   // url: '/Product',
                   // template: nodeTemplate,
                   command: () => {
                    navigate('/Product');
                }
                },
                {
                    key: "3-0",
                    label: 'RowEditingProduct',
                    icon: 'pi pi-heart',
                   // url: '/Product',
                   // template: nodeTemplate,
                   command: () => {
                    navigate('/RowEditingProduct');
                }
                }
            ]
        }
    ]
    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    const menuItems =[
        {
            label: 'Home',
            icon: 'pi pi-home'
        },
        {
            label: 'Features',
            icon: 'pi pi-star'
        },
    ]
    return (
        <>
             <Menubar model={menuItems} start={start} end={end} />
            <div className="card flex ">
                <div className='col-2 mt-5'>
                <PanelMenu model={items} className="w-full md:w-20rem" />
                </div>
                <div className='col-10'>
                {<Outlet/> ?? <h2>Hi</h2>  } 
                </div>
            </div>
        </>
    )
}