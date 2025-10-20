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
  //เก็บผมรวมอของยอดบิล
  const [sumPrice,setsumPrice] = useState(0);
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

        let mySumPrice = 0;
        for(let i=0; i< res.data.result.length; i++){
          mySumPrice += parseInt(res.data.result[i].price);
        }
        setsumPrice(mySumPrice);
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
  const handlePay = async(item)=>{
    try{
      const button = await Swal.fire({
        title: 'ยืนยันการชำระเงิน',
        text: 'คุณได้รับการชำระเงินและตรวจสอบข้อมูลแล้ว',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      });
      if(button.isConfirmed){
        const res = await axios.get(config.apiPath+ '/api/sale/updateStatusToPay/'+ item.id,config.headers());
        if(res.data.message === 'success'){
          Swal.fire({
            title: 'save',
            text : 'บันทึกข้อมูลแล้ว',
            icon: 'success',
            timer: 1500
          })
          fetchData();
        }
      }
    }
    catch(e){
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      })
    }
  }
  const handleSend = async(item)=>{
    try{
      const button = await Swal.fire({
        title: 'ยืนยันการจัดส่ง',
        text: 'ยืนยันการบันทึก',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      });
      if(button.isConfirmed){
        const res = await axios.get(config.apiPath+ '/api/sale/updateStatusToSend/'+ item.id,config.headers());
        if(res.data.message === 'success'){
          Swal.fire({
            title: 'save',
            text : 'บันทึกข้อมูลแล้ว',
            icon: 'success',
            timer: 1500
          })
          fetchData();
        }
      }
    }
    catch(e){
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      })
    }
  }
  const handleCancel = async(item)=>{
    try{
      const button = await Swal.fire({
        title: 'ยกเลิกการสั่งซื้อ',
        text: 'ยืนยันการบันทึก',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      });
      if(button.isConfirmed){
        const res = await axios.get(config.apiPath+ '/api/sale/updateStatusToCancel/'+ item.id,config.headers());
        if(res.data.message === 'success'){
          Swal.fire({
            title: 'save',
            text : 'บันทึกข้อมูลแล้ว',
            icon: 'success',
            timer: 1500
          })
          fetchData();
        }
      }
    }
    catch(e){
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      })
    }
  }
  const displaystatusText = (item)=>{
    if(item.status === 'wait'){
      return <div className="badge badge-dark" >รอตรวจสอบ</div>
    }else if(item.status === 'pay'){
      return <dvi className="badge badge-info">ชำระเงินแล้ว</dvi>
    }else if(item.status ==='send'){
      return  <div className="badge badge-success">จัดส่งแล้ว</div>
    }else if(item.status ==='cancel'){
      return <div className="badge badge-danger" >ยกเลิกรายการ</div>
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
            <th>สถานะ</th>
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
                <td>{displaystatusText(item)}</td>
                <td className="text-center">
                  <button className="btn btn-secondary mr-1"
                    // ผูกกับ modal
                    data-toggle='modal' data-target='#modalInfo'
                    onClick={e=> openModalInfo(item)}>
                    <i className="fa fa-file-alt mr-2"></i>รายการ
                  </button>
                  <button className="btn btn-info mr-1"
                  onClick={e=> handlePay(item)}>
                    <i className="fa fa-check mr-2"></i>ชำระเงินแล้ว
                  </button>
                  <button className="btn btn-success mr-1"
                  onClick={e=> handleSend(item)}>
                    <i className="fa fa-file mr-2"></i>กำลังจัดส่ง
                  </button>
                  <button className="btn btn-danger mr-1"
                  onClick={e=> handleCancel(item)}>
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
              <td className="text-right">{parseInt(item.price).toLocaleString('th-TH')}</td>
              <td className="text-right">1</td>
            </tr>
          ) : <></>}
        </tbody>
      </table>
      <div className="text-center mt-3">
        ยอดรวม {sumPrice.toLocaleString('th-TH')}บาท
      </div>
    </MyModal>
  </Backoffice>
}
export default BillSale;