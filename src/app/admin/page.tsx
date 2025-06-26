"use client";
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import ProductsView from "./ProductsView";
import UsersView from "./UsersView";
import OrdersView from "./OrdersView";

const tabs = ["Products", "Users", "Orders"];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("Products");

    let content = null;
    if (activeTab === "Products") content = <ProductsView />;
    if (activeTab === "Users") content = <UsersView />;
    if (activeTab === "Orders") content = <OrdersView />;

    return (
        <AdminLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            {content}
        </AdminLayout>
    );
} 