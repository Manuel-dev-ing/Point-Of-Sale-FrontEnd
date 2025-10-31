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


export default function Router(){

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<AdminIndexView />} index />
                    <Route path="/categories" element={<CategoriesView />} />
                    <Route path="/clients" element={<ClientsView />} />
                    <Route path="/products" element={<ProductsView />} />
                    <Route path="/products/add" element={<ProducrsCreateView />} />
                    <Route path="/inventory" element={<InventoryView />} />
                </Route>
                <Route element={<PublicLayout />}>
                    <Route path="/sales" element={<SalesPublic />} />
                    <Route path="/shopping" element={<Shopping />} />
                </Route>
                

            </Routes>
        </BrowserRouter>
    );
}








