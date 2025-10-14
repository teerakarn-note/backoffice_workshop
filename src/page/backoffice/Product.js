import axios from "axios";
import MyModal from "../../components/Mymodal";
import Backoffice from "../../components/ฺBackoffice";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import config from "../../config";

function Product() {
    const [products, setProducts] = useState([]);// SHOW
    const [product, setProduct] = useState({});//CREATE, UPDATE
    const [img, setImg] = useState({}); //fire for upload image
    const [fileExcel, setFileExcel] = useState({});
    const refImg = useRef();
    const refExcel = useRef();

    useEffect(() => {
        fetchData();
    }, []);
    const hadleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('img', img);
            const res = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })
            if (res.data.newName !== undefined) {
                return res.data.newName;
            }
        }
        catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error',

            })

        }
    }

    const handlseSave = async () => {
        try {

            // ให้รูปเป็นค่าว่างก่อน
            // เพราะว่าไม่ได้อัพโหลดรูป
            product.img = await hadleUpload();
            // แปลงค่า price และ cost เป็นจำนวนเต็ม
            // เพื่อให้ส่งไปที่ API ได้ถูกต้อง เพราะdatabase จะเก็บเป็นจำนวนเต็ม
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);

            let res;
            if (product.id === undefined) {
                res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            } else {
                res = await axios.put(config.apiPath + '/product/update/', product, config.headers());
            }
            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    text: 'success',
                    icon: 'success',
                    timer: 2000,
                })
                document.getElementById('modalProduct_btnClose').click();
                fetchData();
                setProduct({ ...product, id: undefined });// clear id
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error',
            })
        }
    }
    // เอาข้อมูลสินค้าออกมาแสดง จากหลังบ้าน database
    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());
            console.log(res.data);
            if (res.data.result !== undefined) {
                setProducts(res.data.result);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error',
            })
        }
    }
    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: '',

        })
        setImg(null);
        refImg.current.value = '';
    }
    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                text: 'remove item',
                title: 'remove',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })
            if (button.isConfirmed) {
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers());
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'remove ',
                        text: 'remove success',
                        icon: 'success',
                        timer: 2000,
                    })
                    fetchData();
                }
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error',
            })
        }
    }
    const selectedFile = (inputFile) => {
        if (inputFile !== undefined) {
            if (inputFile.length > 0) {
                setImg(inputFile[0]);
            }
        }
    }
    const showImage = (item) => {
        if (item.img !== "") {
            return <img className="img-fluid" src={config.apiPath + '/uploads/' + item.img} />;
        }
        return <></>;

    }
    
    const selectedFileExcel = (fileInput) => {
        if(fileInput !== undefined){
            if(fileInput.length > 0){
                setFileExcel(fileInput[0]);
            }
        }
    }
    const hadleUploadExcel = async () => {
        try{
            const formData  = new FormData();
            formData.append('fileExcel', fileExcel);
            const res = await axios.post(config.apiPath + '/product/uploadFromExcel', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            });
            if(res.data.message === 'success'){
                Swal.fire({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    text: 'success',
                    icon: 'success',
                    timer: 1000,
                })
                fetchData();
                // ปิด modal
                document.getElementById('modalExcel_btnClose').click();

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
    const clearFormExcel = () => {
        refExcel.current.value = '';
        setFileExcel(null);

    }
    return <Backoffice>
        <div className="h4">Product</div>
        <button onClick={clearForm} className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus mr-2"></i> เพิ่มรายการ
        </button>
        <button  onClick={clearFormExcel} className="btn btn-success" data-toggle='modal' data-target='#modalExcel'>
            <i className="fa fa-arrow-down mr-2"></i>Import from excel
        </button>
        <table className=" mt-3 table table-bordered table-striped">
            <thead>
                <tr>
                    <th width='150px'>ภาพสินค้า</th>
                    <th>name</th>
                    <th widht='150px' className="text-right">cost</th>
                    <th width='150px' className="text-right">price</th>
                    <th width='140px'></th>
                </tr>
            </thead>
            {/* เมื่อมีสินค้านำมาเข้าloop เก็บไว้ในตัวแปรitem */}
            <tbody>
                {products.length > 0 ? products.map(item =>
                    <tr key={item.id}>
                        <td>{showImage(item)}</td>
                        <td>{item.name}</td>
                        <td className="text-right">{item.cost}</td>
                        <td className="text-right">{item.price}</td>
                        <td className="text-center">
                            <button className="btn btn-primary mr-2"
                                data-toggle='modal'
                                // data-toggle='modal'คือการเปิด modal
                                // data-target='#modalProduct' คือการระบุว่า modal ที่จะเปิดคืออะไร ชื่อ modalProduct
                                data-target='#modalProduct'
                                //onClick={e => setProduct(item)}>คือเซตค่า product ให้เป็น item ที่เรากด มีitemอยูุ่หลายตัว
                                onClick={e => setProduct(item)}>
                                <i className="fa fa-edit"></i>
                            </button>
                            <button className="btn btn-danger" onClick={e => handleRemove(item)}>
                                <i className="fa fa-times">
                                </i>
                            </button>
                        </td>
                    </tr>
                ) : <></>}


            </tbody>
        </table>
        <MyModal id='modalProduct' title='สินค้า'>
            <div>
                <div>ชื่อสินค้า</div>
                <input value={product.name} className="form-control" onChange={e => setProduct({ ...product, name: e.target.value })} ></input>
            </div>
            <div className="mt-3">
                <div>ราคาทุน</div>
                <input value={product.cost} className="form-control" onChange={e => setProduct({ ...product, cost: e.target.value })}></input>
            </div>
            <div className="mt-3">
                <div>ราคาขาย</div>
                <input value={product.price} className="form-control" onChange={e => setProduct({ ...product, price: e.target.value })}></input>
            </div>
            <div className="mt-3">
                <div className="mb-3">{showImage(product)}</div>
                <div>ภาพสินค้า</div>
                <input className="form-control" type='file' ref={refImg} onChange={e => selectedFile(e.target.files)}></input>
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handlseSave}>
                    <i className="fa fa-check mr-2"></i> seve
                </button>

            </div>
        </MyModal>
        <MyModal id='modalExcel' title='เลือกไฟล์'>
            <div>เลือกไฟล์</div>
            <input className="form-control" type='file' ref = {refExcel} onChange={e=> selectedFileExcel(e.target.files)} >
            </input>
            <button className="mt-3 btn btn-primary" onClick={hadleUploadExcel}>
                <i className="fa fa-check mr-2"></i> Save
            </button>
        </MyModal>
    </Backoffice>
}

export default Product;