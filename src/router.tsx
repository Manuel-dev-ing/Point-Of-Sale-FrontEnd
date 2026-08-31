import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
import AdminIndexView from "./views/AdminIndexView";
import CategoriesView from "./views/CategoriesView";
import ClientsView from "./views/ClientsView";
import ProductsView from "./views/ProductsView";
import ProducrsCreateView from "./views/ProducrsCreateView";
import SalesPublic from "./views/SalesPublic";
import PublicLayout from "./Layouts/PublicLayout";
import Shopping from "./views/Shopping";
import InventoryView from "./views/InventoryView";
import ReportsView from "./views/ReportsView";
import UsersView from "./views/UsersView";
import Login from "./views/Login";
import { usePosNetStore } from "./store";
import type { AuthUser } from "./types";
import Invoice from "./components/invoice/invoice";
import SettingsView from "./views/SettingsView";


export default function Router(){

    const dataAuth = usePosNetStore((state) => state.dataAuthProfileUser as AuthUser)
    console.log(dataAuth);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminLayout user={dataAuth} />}>
                    <Route path="/" element={<AdminIndexView />} index />
                    <Route path="/categories" element={<CategoriesView />} />
                    <Route path="/clients" element={<ClientsView />} />
                    <Route path="/products" element={<ProductsView />} />
                    <Route path="/products/add" element={<ProducrsCreateView />} />
                    <Route path="/inventory" element={<InventoryView />} />
                    <Route path="/reports" element={<ReportsView />} />
                    <Route path="/users" element={<UsersView />} />
                    <Route path="/settings" element={<SettingsView />} />

                </Route>
                <Route element={<PublicLayout />}>
                    <Route path="/sales" element={<SalesPublic />} />
                    <Route path="/shopping" element={<Shopping />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/invoice" element={<Invoice />} />

            </Routes>
        </BrowserRouter>
    );
}








