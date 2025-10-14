import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ControlSidebar from './ControlSidebar';
// import Product from '../page/backoffice/Product';
function Backoffice(props){
    return<>
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper p-3">
                {props.children}
            </div>
            <Footer/>
            <ControlSidebar/>
        </div>
    </>
}
export default Backoffice;