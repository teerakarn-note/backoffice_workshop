import { useEffect, useState } from "react";
import Backoffice from "../../components/ฺBackoffice";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import dayjs from "dayjs";
import MyModal from "../../components/Mymodal";
function BillSale() {
  const [billSales, setBillSales] = useState([]);
  const [billSaleDetails, setBillSaleDetails] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + '/api/sale/list', config.headers());
      if (res.data.results !== undefined) {
        setBillSales(res.data.results);
      }
    } catch (e) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }
  const openModalInfo = async (item) => {
    try {
      const res = await axios.get(config.apiPath + '/api/sale/billInfo/' + item.id, config.headers());

      if (res.data.result !== undefined) {
        setBillSaleDetails(res.data.result);
      }
    }
    catch (e) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }

  }
  return <Backoffice>
    <div className="card">
      <div className=" card-header">
        <div className="card-title">รายงานยอดขาย</div>
      </div>
      <div className="card-body">
        <table className="table table-bordered table-striped">
          <thead>
            <th>ลูกค้า</th>
            <th>เบอร์โทร</th>
            <th>ที่อยู่</th>
            <th>วันที่ชำระเงิน</th>
            <th>เวลา</th>
            <th width='600px'></th>

          </thead>
          <tbody>
            {billSales.length > 0 ? billSales.map(item =>
              <tr key={item.id}>
                <td>{item.customerName}</td>
                <td>{item.customerPhone}</td>
                <td>{item.customerAddress}</td>
                <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                <td>{item.payTime}</td>
                <td className="text-center">
                  <button className="btn btn-secondary mr-1"
                    // ผูกกับ modal
                    data-toggle='modal' data-target='#modalInfo'
                    onClick={e => openModalInfo(item)}>
                    <i className="fa fa-file-alt mr-2"></i>รายการ
                  </button>
                  <button className="btn btn-info mr-1">
                    <i className="fa fa-check mr-2"></i>ได้รับสินค้าแล้ว
                  </button>
                  <button className="btn btn-success mr-1">
                    <i className="fa fa-file mr-2"></i>กำลังจัดส่ง
                  </button>
                  <button className="btn btn-danger mr-1">
                    <i className="fa fa-times mr-2"></i>ยกเลิกคำสั่งซื้อ
                  </button>
                </td>
              </tr>
            ) : <></>}
          </tbody>
        </table>
      </div>
    </div>
    <MyModal id='modalInfo' title='รายการของบิล'>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>รายการ</th>
            <th className="text-right">ราคา</th>
            <th className="text-right">จำนวน</th>
          </tr>
        </thead>
        <tbody>
          {billSaleDetails.length > 0 ? billSaleDetails.map(item =>
            <tr key = {item.id}>
              {/* เมื่อมีการ join ตาราง  */}
              <td>{item.Product.name}</td>
              <td className="text-right">{item.price}</td>
              <td className="text-right">1</td>
            </tr>
          ) : <></>}
        </tbody>
      </table>
    </MyModal>
  </Backoffice>
}
export default BillSale;