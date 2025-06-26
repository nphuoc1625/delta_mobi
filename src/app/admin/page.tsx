"use client";
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import ProductsView from "./tab_product/ProductsView";
import UsersView from "./UsersView";
import OrdersView from "./OrdersView";
import CategoriesView from "./CategoriesView";

const tabs = ["Products", "Categories", "Users", "Orders"];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("Products");

    let content = null;
    if (activeTab === "Products") content = <ProductsView />;
    if (activeTab === "Categories") content = <CategoriesView />;
    if (activeTab === "Users") content = <UsersView />;
    if (activeTab === "Orders") content = <OrdersView />;

    return (
        <AdminLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            {content}
        </AdminLayout>
    );
} 