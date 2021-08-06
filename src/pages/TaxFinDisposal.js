/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaTrash} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import disposal from '../redux/actions/disposal'
import setuju from '../redux/actions/setuju'
import {connect} from 'react-redux'
import moment from 'moment'
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

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
})

const taxSchema = Yup.object().shape({
    no_fp: Yup.string().required('must be filled')
})

const finSchema = Yup.object().shape({
    nominal: Yup.string().required('must be filled'),
    no_sap: Yup.string().required('must be filled')
})

const assetSchema = Yup.object().shape({
    no_fp: Yup.string().required('must be filled')
})

class TaxFinDisposal extends Component {
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
            alertSubmit: false
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

    submitTaxFinDisposal = async (value) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        if (value.no_fp === null && level === '3') {
            this.setState({alertSubmit: true})
       
            setTimeout(() => {
               this.setState({
                   alertSubmit: false
               })
            }, 10000)
        } else if ((value.no_sap === null || value.nominal === null) && level === '4') {
            this.setState({alertSubmit: true})
       
            setTimeout(() => {
               this.setState({
                   alertSubmit: false
               })
            }, 10000)
        } else {
            await this.props.submitTaxFin(token, value.no_asset)
            this.getDataDisposal()
        }
    }

    submitFinalDisposal = async (value) => {
        const token = localStorage.getItem('token')
        if (value.doc_sap === null || value.doc_sap === '') {
            this.setState({alertSubmit: true})
       
            setTimeout(() => {
               this.setState({
                   alertSubmit: false
               })
            }, 10000)
        } else {
            await this.props.submitFinal(token, value.no_asset)
            this.getDataDisposal()
        }
    }

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed' && type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, rar, and image files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocumentDis(token, detail.id, data)
        }
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
        this.setState({modalRinci: !this.state.modalRinci})
    }

    openProsesDocTax = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', 'tax')
        this.closeProsesModalDoc()
    }

    openProsesDocFinance = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', 'finance')
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

    componentDidUpdate() {
        const {isError, isGet, isUpload, isSubmit} = this.props.disposal
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
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
                if (level === '3') {
                    this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'tax')
                } else if (level === '4') {
                    this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'finance')
                }
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
        this.getDataDisposal()
    }

    getDataDisposal = async () => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        if (level === '2') {
            await this.props.getDisposal(token, 10, '',  1, 7)
        } else if (level === '3' || level === '4') {
            await this.props.getDisposal(token, 10, '',  1, 6)   
        }
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
        const level = localStorage.getItem('level')
        const { dataRinci } = this.state
        if (level === '3') {
            await this.props.updateDisposal(token, dataRinci.id, value, 'taxDis')
            this.getDataDisposal()   
        } else if (level === '4') {
            await this.props.updateDisposal(token, dataRinci.id, value, 'financeDis')
            this.getDataDisposal()
        } else {
            await this.props.updateDisposal(token, dataRinci.id, value)
            this.getDataDisposal()
        }
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, dataRinci} = this.state
        const {dataDis, isGet, alertM, alertMsg, alertUpload, page, dataDoc} = this.props.disposal
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                    href="#"
                    onClick={this.menuButtonClick}
                    >
                        <FaBars size={20} className={style.white} />
                    </NavbarBrand>
                    <div className={style.divLogo}>
                        <marquee className={style.marquee}>
                            <span>WEB ASSET</span>
                        </marquee>
                        <div className={style.textLogo}>
                            <FaUserCircle size={24} className="mr-2" />
                            <text className="mr-3">{level === '1' ? 'Super admin' : names }</text>
                        </div>
                    </div>
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
                            {level === '3' ? (
                                <div className={style.bodyDashboard}>
                                <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                    <div>{alertMsg}</div>
                                    <div>{alertM}</div>
                                </Alert>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard1}>Tax Disposal</div>
                                </div>
                                <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                    <div>Lengkapi data asset terlebih dahulu</div>
                                </Alert>
                                <Row className="cartDisposal2">
                                    {dataDis.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Tidak ada data disposal</div>
                                        </Col>
                                    ) : (
                                        <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                        {dataDis.length !== 0 && dataDis.map(item => {
                                            return (
                                                <div className="cart1">
                                                    <div className="navCart">
                                                        <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="warning" size="sm">{item.nilai_jual === '0' ? 'Pemusnahan' : 'Penjualan'}</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart mb-3">{item.nama_asset}</div>
                                                                <div className="noCart mb-3">No asset : {item.no_asset}</div>
                                                                <div className="noCart mb-3">No disposal : D{item.no_disposal}</div>
                                                                <div className="noCart mb-3">{item.keterangan}</div>
                                                                <Button color="success" onClick={() => this.submitTaxFinDisposal(item)}>Submit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="footCart">
                                                        <Button color="primary" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}>Rincian</Button>
                                                        <div></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                    )}
                                </Row>
                            </div>
                            ) : level === '4' ? (
                                <div className={style.bodyDashboard}>
                                <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                    <div>{alertMsg}</div>
                                    <div>{alertM}</div>
                                </Alert>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard1}>Finance Disposal</div>
                                </div>
                                <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                    <div>Lengkapi data asset terlebih dahulu</div>
                                </Alert>
                                <Row className="cartDisposal2">
                                    {dataDis.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Tidak ada data disposal</div>
                                        </Col>
                                    ) : (
                                        <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                        {dataDis.length !== 0 && dataDis.map(item => {
                                            return (
                                                <div className="cart1">
                                                    <div className="navCart">
                                                        <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="warning" size="sm">{item.nilai_jual === '0' ? 'Pemusnahan' : 'Penjualan'}</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart mb-3">{item.nama_asset}</div>
                                                                <div className="noCart mb-3">No asset : {item.no_asset}</div>
                                                                <div className="noCart mb-3">No disposal : D{item.no_disposal}</div>
                                                                <div className="noCart mb-3">{item.keterangan}</div>
                                                                <Button color="success" onClick={() => this.submitTaxFinDisposal(item)}>Submit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="footCart">
                                                        <Button color="primary" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}>Rincian</Button>
                                                        <div></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                    )}
                                </Row>
                            </div>
                            ) : level === '2' ? (
                                <div className={style.bodyDashboard}>
                                <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                    <div>{alertMsg}</div>
                                    <div>{alertM}</div>
                                </Alert>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard1}>Finance & Tax Disposal</div>
                                </div>
                                <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                    <div>Lengkapi data asset terlebih dahulu</div>
                                </Alert>
                                <Row className="cartDisposal2">
                                    {dataDis.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Tidak ada data disposal</div>
                                        </Col>
                                    ) : (
                                        <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                        {dataDis.length !== 0 && dataDis.map(item => {
                                            return (
                                                <div className="cart1">
                                                    <div className="navCart">
                                                        <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="warning" size="sm">{item.nilai_jual === '0' ? 'Pemusnahan' : 'Penjualan'}</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart mb-3">{item.nama_asset}</div>
                                                                <div className="noCart mb-3">No asset : {item.no_asset}</div>
                                                                <div className="noCart mb-3">No disposal : D{item.no_disposal}</div>
                                                                <div className="noCart mb-3">{item.keterangan}</div>
                                                                <div className="btnVerTax">
                                                                    <Button color="success" onClick={() => this.submitFinalDisposal(item)}>Approve</Button>
                                                                    <Button color="danger ml-2"  >Reject</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="footCart">
                                                        <Button color="primary mr-4" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}>Rincian</Button>
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
                <Modal isOpen={this.props.disposal.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                Kelengkapan Dokumen Eksekusi Disposal
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
                                        <Col md={6} lg={6} >
                                            {x.status === 0 ? (
                                                <AiOutlineClose size={20} />
                                            ) : x.status === 3 ? (
                                                <AiOutlineCheck size={20} />
                                            ) : (
                                                <BsCircle size={20} />
                                            )}
                                            <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
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
                                            {level === '2' ? (
                                                <text>-</text>
                                            ) : (
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            )}
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
            <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                <ModalHeader>
                    Rincian
                </ModalHeader>
                <ModalBody>
                    <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                        <div>{alertM}</div>
                    </Alert>
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
                            merk: dataRinci.merk,
                            no_sap: dataRinci.no_sap === null ? '' : dataRinci.no_sap,
                            nominal: dataRinci.nominal === null ? '' : dataRinci.nominal,
                            doc_sap: dataRinci.doc_sap === null ? '' : dataRinci.doc_sap,
                            no_fp: dataRinci.no_fp === null ? '' : dataRinci.no_fp
                        }}
                        validationSchema = {level === '2' ? assetSchema : level === '3' ? taxSchema : level === '4' ? finSchema : disposalSchema}
                        onSubmit={(values) => {this.updateDataDis(values)}}
                        >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className="rightRinci">
                                <div>
                                    <div className="titRinci">{dataRinci.nama_asset}</div>
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
                                            onBlur={handleBlur("merk")}
                                            onChange={handleChange("merk")}
                                            disabled
                                            />
                                        </Col>
                                    </Row>
                                    {errors.merk ? (
                                        <text className={style.txtError}>{errors.merk}</text>
                                    ) : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Kategori</Col>
                                        <Col md={9} className="katCheck">: 
                                            <div className="katCheck">
                                                <div className="ml-2"><input type="checkbox" disabled/> IT</div>
                                                <div className="ml-3"><input type="checkbox" disabled/> Non IT</div>
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
                                        <Col md={9} className="colRinci">:  <Input className="inputRinci" disabled /></Col>
                                    </Row>
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Nilai Jual</Col>
                                        <Col md={9} className="colRinci">:  <Input 
                                            className="inputRinci" 
                                            value={values.nilai_jual} 
                                            onBlur={handleBlur("nilai_jual")}
                                            onChange={handleChange("nilai_jual")}
                                            disabled
                                            />
                                        </Col>
                                    </Row>
                                    {errors.nilai_jual ? (
                                        <text className={style.txtError}>{errors.nilai_jual}</text>
                                    ) : null}
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Keterangan</Col>
                                        <Col md={9} className="colRinci">:  <Input
                                            className="inputRinci" 
                                            type="text" 
                                            value={values.keterangan} 
                                            onBlur={handleBlur("keterangan")}
                                            onChange={handleChange("keterangan")}
                                            disabled
                                            />
                                        </Col>
                                    </Row>
                                    {errors.keterangan ? (
                                        <text className={style.txtError}>{errors.keterangan}</text>
                                    ) : null}
                                    {level === '2' ? (
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Doc Finance</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value = {dataRinci.no_sap} disabled/></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nominal Penjualan</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value = {dataRinci.nominal} disabled/></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Faktur Pajak</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value = {dataRinci.no_fp} disabled/></Col>
                                            </Row>
                                            <Row className="mb-5 rowRinci">
                                                <Col md={3}>No Doc SAP</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text" 
                                                    className="inputRinci" 
                                                    value={values.doc_sap} 
                                                    onBlur={handleBlur("doc_sap")}
                                                    onChange={handleChange("doc_sap")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.doc_sap ? (
                                                <text className={style.txtError}>{errors.doc_sap}</text>
                                            ) : null}
                                        </div>
                                    ) : level === '3' ? (
                                        <div>
                                            <Row className="mb-5 rowRinci">
                                                <Col md={3}>Faktur Pajak</Col>
                                                <Col md={9} className="colRinci">:  <Input 
                                                    type="text" 
                                                    className="inputRinci" 
                                                    value={values.no_fp} 
                                                    onBlur={handleBlur("no_fp")}
                                                    onChange={handleChange("no_fp")}
                                                    />
                                                </Col>
                                                {errors.no_fp ? (
                                                    <text className={style.txtError}>{errors.no_fp}</text>
                                                ) : null}
                                            </Row>
                                        </div>
                                    ) : level === '4' ? (
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Doc Finance</Col>
                                                <Col md={9} className="colRinci">:  <Input 
                                                    type="text" 
                                                    className="inputRinci" 
                                                    value={values.no_sap} 
                                                    onBlur={handleBlur("no_sap")}
                                                    onChange={handleChange("no_sap")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.no_sap ? (
                                                <text className={style.txtError}>{errors.no_sap}</text>
                                            ) : null}
                                            <Row className="mb-5 rowRinci">
                                                <Col md={3}>Nominal Penjualan</Col>
                                                <Col md={9} className="colRinci">:  <Input 
                                                    type="text" 
                                                    className="inputRinci" 
                                                    value={values.nominal} 
                                                    onBlur={handleBlur("nominal")}
                                                    onChange={handleChange("nominal")}
                                                    />
                                                </Col>
                                                {errors.nominal ? (
                                                    <text className={style.txtError}>{errors.nominal}</text>
                                                ) : null}
                                            </Row>
                                        </div>
                                    ) : (
                                        <Row></Row>
                                    )}
                                </div>
                                {level === '2' ? (
                                    <div className="footRinci1">
                                        <Button className="btnFootRinci1 mr-2" size="md" color="warning" onClick={() => this.openProsesDocFinance(dataRinci)}>Doc Finance</Button>
                                        <Button className="btnFootRinci1 mr-2" size="md" color="success" onClick={() => this.openProsesDocTax(dataRinci)}>Doc Tax</Button>
                                        <Button className="btnFootRinci1 mr-2" size="md" color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                    </div>
                                ) : (
                                    <div className="footRinci1">
                                        <Button className="btnFootRinci1" size="md" color="primary" onClick={handleSubmit}>Save</Button>
                                        {level === "3" ? (
                                            <Button className="btnFootRinci1" size="md" color="success" onClick={() => this.openProsesDocTax(dataRinci)}>Upload Doc</Button>
                                        ) : level === '4' && (
                                            <Button className="btnFootRinci1" size="md" color="success" onClick={() => this.openProsesDocFinance(dataRinci)}>Upload Doc</Button>
                                        )}
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                    </div>
                                )}
                            </div>
                        )}
                        </Formik>
                    </div>
                </ModalBody>
            </Modal>
        </>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    setuju: state.setuju
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getDisposal,
    submitDisposal: disposal.submitDisposal,
    resetError: disposal.reset,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    submitTaxFin: setuju.submitTaxFinDisposal,
    submitFinal: setuju.submitFinalDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxFinDisposal)