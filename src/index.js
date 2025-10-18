import React from 'react';
import ReactDOM from 'react-dom/client';
import{
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import SingIn from './page/backoffice/Singin';
import Home from './page/backoffice/Home';
import Product from './page/backoffice/Product';
import BillSale from './page/backoffice/BillSale';

const router = createBrowserRouter([

  // การกำหนดเส้นทางของแอปพลิเคชัน
  // โดยใช้ React Router
  // เพิ่มหน้าส่วนนี้
  {
    path: '/',
    element: <SingIn/>
  },
  {
    path:'/home',
    element: <Home/>
  },
  {
    path : '/product',
    element : <Product />
  },
  {
    path : '/billSale',
    element : <BillSale />
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
);
