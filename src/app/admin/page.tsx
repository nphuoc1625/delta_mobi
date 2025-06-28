"use client";
import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import ProductsView from "./tab_product/ProductsView";
import UsersView from "./UsersView";
import OrdersView from "./OrdersView";
import CategoriesView from "./tab_category/CategoriesView";

const tabs = ["Products", "Categories", "Users", "Orders"];
const TAB_KEY = "adminTabIndex";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(TAB_KEY) || "Products";
        }
        return "Products";
    });

    useEffect(() => {
        localStorage.setItem(TAB_KEY, activeTab);
    }, [activeTab]);

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