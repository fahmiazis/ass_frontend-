/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaTrash, FaFileSignature} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import disposal from '../redux/actions/disposal'
import setuju from '../redux/actions/setuju'
import {connect} from 'react-redux'
import moment from 'moment'
import Pdf from "../components/Pdf"
import pengadaan from '../redux/actions/pengadaan'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
import placeholder from  "../assets/img/placeholder.png"
import a from "../assets/img/a.jpg"
import b from "../assets/img/b.jpg"
import c from "../assets/img/c.jpg"
import d from "../assets/img/d.jpg"
import e from "../assets/img/e.jpg"
import f from "../assets/img/f.png"
import g from "../assets/img/g.png"
import notif from '../redux/actions/notif'
import NavBar from '../components/NavBar'
const {REACT_APP_BACKEND_URL} = process.env

const dokumenSchema = Yup.object().shape({
    nama_dokumen: Yup.string().required(),
    jenis_dokumen: Yup.string().required(),
    divisi: Yup.string().required(),
});

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

class EditPurch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            transitions: true,
            touch: true,
            shadow: true,
            pullRight: false,
            touchHandleWidth: 20,
            dragToggleDistance: 30,
            alert: false,
            confirm: "",
            isOpen: false,
            dropOpen: false,
            dropOpenNum: false,
            value: '',
            onChange: new Date(),
            sidebarOpen: false,
            modalAdd: false,
            modalEdit: false,
            modalUpload: false,
            modalDownload: false,
            modalConfirm: false,
            detail: {},
            dataDivisi: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            modalRinci: false,
            dataRinci: {},
            openModalDoc: false,
            alertSubmit: false,
            openPdf: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        const {isShow} = this.props.pengadaan
        if (isShow) {
            this.openModalPdf()
        }
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    downloadData = () => {
        const { fileName } = this.state
        const download = fileName.path.split('/')
        const cek = download[2].split('.')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName.nama_dokumen}.${cek[1]}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, and rar files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocumentDis(token, detail.id, data, 'edit', 'peng')
        }
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
        this.setState({modalRinci: !this.state.modalRinci})
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'purch')
        this.closeProsesModalDoc()
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    deleteItem = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.deleteDisposal(token, value)
        this.getDataDisposal()
    }

    submitRevisi = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDocumentDis(token, val.no_asset, 'disposal', 'purch')
        this.getDataDisposal()
        this.openConfirm()
    }

    componentDidUpdate() {
        const {isError, isGet, isUpload, isSubmit} = this.props.disposal
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'purch')
             }, 1100)
        } else if (isSubmit) {
            this.props.resetError()
            setTimeout(() => {
                this.getDataDisposal()
             }, 1000)
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDisposal({limit: 10, search: this.state.search})
        }
    }

    componentDidMount() {
        this.getNotif()
        this.getDataDisposal()
    }

    getDataDisposal = async () => {
        const token = localStorage.getItem('token')
        await this.props.getPurchasing(token)
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    updateDataDis = async (value) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, value)
        this.getDataDisposal()
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, dataRinci} = this.state
        const {isGet, alertM, alertMsg, alertUpload, page, dataDoc} = this.props.disposal
        const {dataPurch} = this.props.setuju
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                    href="#"
                    onClick={this.menuButtonClick}
                    >
                        <FaBars size={20} className={style.white} />
                    </NavbarBrand>
                    <NavBar />
            </div>
        )

        const sidebar = <SidebarContent />
        const sidebarProps = {
            sidebar,
            docked: this.state.docked,
            sidebarClassName: "custom-sidebar-class",
            contentId: "custom-sidebar-content-id",
            open: this.state.open,
            touch: this.state.touch,
            shadow: this.state.shadow,
            pullRight: this.state.pullRight,
            touchHandleWidth: this.state.touchHandleWidth,
            dragToggleDistance: this.state.dragToggleDistance,
            transitions: this.state.transitions,
            onSetOpen: this.onSetOpen
          };
        return (
            <>
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                        {level === '6' ? (
                            <div className={style.bodyDashboard}>
                            <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                <div>{alertMsg}</div>
                                <div>{alertM}</div>
                                {alertUpload !== undefined && alertUpload.map(item => {
                                    return (
                                        <div>{item}</div>
                                    )
                                })}
                            </Alert>
                            <div className={style.headMaster}>
                                <div className={style.titleDashboard1}>Revisi Purchasing Disposal</div>
                            </div>
                            <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                <div>Lengkapi rincian data asset yang ingin diajukan</div>
                            </Alert>
                            <Row className="cartDisposal2">
                                {dataPurch.length === 0 ? (
                                    <Col md={8} xl={8} sm={12}>
                                        <div className="txtDisposEmpty">Revisi Data is empty</div>
                                    </Col>
                                ) : (
                                    <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                    {dataPurch.length !== 0 && dataPurch.map(item => {
                                        return (
                                            <div className="cart1">
                                                <div className="navCart">
                                                    <img src={placeholder} className="cartImg" />
                                                    <div className="txtCart">
                                                        <div>
                                                            <div className="nameCart mb-3">{item.disposal[0].nama_asset}</div>
                                                            <div className="noCart mb-3">No asset : {item.disposal[0].no_asset}</div>
                                                            <div className="noCart mb-3">No disposal : D{item.disposal[0].no_disposal}</div>
                                                            <div className="noCart mb-3">Alasan reject: {item.alasan === null ? 'Salah satu dokumen tidak sesuai' : item.alasan}</div>
                                                            <Button color="success" onClick={() => this.submitRevisi(item.disposal[0])}>Submit</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="footCart">
                                                    <Button color="primary" onClick={() => this.openModalRinci(this.setState({dataRinci: item.disposal[0]}))}>Rincian</Button>
                                                    <div></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Col>
                                )}
                            </Row>
                        </div>
                        ) : (
                            <div className={style.headMaster}>
                                <div className={style.titleDashboard1}>Anda tidak memiliki akses dihalaman ini</div>
                            </div>
                        )}
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci">
                            <div className="leftRinci">
                                <img src={dataRinci.no_asset === '4100000150' ? b : dataRinci.no_asset === '4300001770' ? e : placeholder} className="imgRinci" />
                                <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? b : dataRinci.no_asset === '4300001770' ? e : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? a : dataRinci.no_asset === '4300001770' ? d : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? c : dataRinci.no_asset === '4300001770' ? f : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? a : dataRinci.no_asset === '4300001770' ? g : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? c : dataRinci.no_asset === '4300001770' ? d : placeholder} className="imgSmallRinci" />
                                    </button>
                                </div>
                            </div>
                            <Formik
                            initialValues = {{
                                keterangan: dataRinci.keterangan === null ? '' : dataRinci.keterangan,
                                nilai_jual: dataRinci.nilai_jual,
                                merk: dataRinci.merk
                            }}
                            validationSchema = {disposalSchema}
                            onSubmit={(values) => {this.updateDataDis(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci">
                                    <div>
                                        <div className="titRinci">{dataRinci.nama_asset}</div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Area</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk / Type</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.merk}
                                                disabled
                                                onBlur={handleBlur("merk")}
                                                onChange={handleChange("merk")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.merk ? (
                                            <text className={style.txtError}>{errors.merk}</text>
                                        ) : null}
                                        <Row className="mb-2">
                                            <Col md={3}>Kategori</Col>
                                            <Col md={9} className="katCheck">: 
                                                <div className="katCheck">
                                                    <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false} /> IT</div>
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false} /> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Area</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.status_depo} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" disabled value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? 0 : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col  md={3}>Nilai Jual</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                value={values.nilai_jual === null ? values.nilai_jual : values.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 
                                                onBlur={handleBlur("nilai_jual")}
                                                onChange={handleChange("nilai_jual")}
                                                disabled={true}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nilai_jual ? (
                                            <text className={style.txtError}>{errors.nilai_jual}</text>
                                        ) : null}
                                        <Row className="mb-4 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                type="text"
                                                disabled={level !== 5 ? true : false}
                                                value={values.keterangan} 
                                                onBlur={handleBlur("keterangan")}
                                                onChange={handleChange("keterangan")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.keterangan ? (
                                            <text className={style.txtError}>{errors.keterangan}</text>
                                        ) : null}
                                    </div>
                                    <div className="footRinci1">
                                        <Button className="btnFootRinci1" size="lg" color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="lg" color="success" onClick={this.openProsesModalDoc}>Upload Doc</Button>
                                        <Button className="btnFootRinci1" size="lg" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.disposal.isLoading || this.props.setuju.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                            {dataDoc !== undefined && dataDoc.find(({status}) => status === 0) ? (
                                <div>
                                    <div className={style.cekUpdate}>
                                        <AiOutlineClose size={80} className={style.red} />
                                        <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                        <div className="errApprove mt-2">Revisi Dokumen Terlebih Dahulu</div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className={style.cekUpdate}>
                                        <AiFillCheckCircle size={80} className={style.green} />
                                        <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                                    </div>
                                </div>
                            )}
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Alert color="danger" className="alertWrong" isOpen={this.state.upload}>
                            <div>{this.state.errMsg}</div>
                        </Alert>
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                <Row className="mt-3 mb-4">
                                    <Col md={6} lg={6} >
                                        <text>{x.nama_dokumen}</text>
                                    </Col>
                                    {x.path !== null ? (
                                        <Col md={6} lg={6}>
                                            <div className="lsDoc">
                                                {x.status === 0 ? (
                                                    <AiOutlineClose size={20} />
                                                ) : x.status === 3 ? (
                                                    <AiOutlineCheck size={20} />
                                                ) : (
                                                    <BsCircle size={20} />
                                                )}
                                                {x.divisi === '0' ? (
                                                    <AiOutlineClose size={20} />
                                                ) : x.divisi === '3' ? (
                                                    <AiOutlineCheck size={20} />
                                                ) : (
                                                    <div></div>
                                                )}
                                                <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                            </div>
                                            <div>
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            <input
                                            className="ml-4"
                                            type="file"
                                            onClick={() => this.setState({detail: x})}
                                            onChange={this.onChangeUpload}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button className="mr-2" color="secondary" onClick={this.closeProsesModalDoc}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.closeProsesModalDoc}>
                            Save 
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                <ModalBody>
                    <div className={style.readPdf}>
                        <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div>
                            <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                        </div>
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                    </div>
                </ModalBody>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    notif: state.notif,
    setuju: state.setuju
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getNewDisposal,
    submitDisposal: disposal.submitDisposal,
    resetError: disposal.reset,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    showDokumen: pengadaan.showDokumen,
    getNotif: notif.getNotif,
    getPurchasing: setuju.getDataPurch
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPurch)
