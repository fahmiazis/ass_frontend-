/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col, Card, CardBody,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner, Collapse} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import Pdf from "../../components/Pdf"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaTrash, FaFileSignature} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import pengadaan from '../../redux/actions/pengadaan'
import disposal from '../../redux/actions/disposal'
import tracking from '../../redux/actions/tracking'
import setuju from '../../redux/actions/setuju'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import placeholder from  "../../assets/img/placeholder.png"
import b from "../../assets/img/b.jpg"
import e from "../../assets/img/e.jpg"
import NavBar from '../../components/NavBar'
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

class TrackingMutasi extends Component {
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
            openPdf: false,
            newMut: [],
            detailMut: [],
            formDis: false,
            collap: false,
            tipeCol: ''
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

    showCollap = (val) => {
        if (val === 'close') {
            this.setState({collap: false})
        } else {
            this.setState({collap: false})
            setTimeout(() => {
                this.setState({collap: true, tipeCol: val})
             }, 500)
        }
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
        this.setState({openModalDoc: !this.state.openModalDoc})
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
            this.props.uploadDocumentDis(token, detail.id, data)
        }
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
        this.setState({modalRinci: !this.state.modalRinci})
    }

    openProsesModalDoc = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({dataRinci: value})
        console.log(value)
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', value.nilai_jual === "0" ? 'dispose' : 'sell')
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
                this.props.getDocumentDis(token, dataRinci.no_asset)
             }, 1100)
        } else if (isSubmit) {
            this.props.resetError()
            setTimeout(() => {
                this.getDataTrack()
             }, 1000)
        }
    }

    componentDidMount() {
        this.getDataTrack()
    }

    getDataTrack = async () => {
        const token = localStorage.getItem('token')
        await this.props.trackMutasi(token)
        this.filterData()
    }
    
    filterData = () => {
        const { noMut, dataMut } = this.props.tracking
        const newMut = []
        for (let i = 0; i < noMut.length; i++) {
            const index = dataMut.indexOf(dataMut.find(({no_mutasi}) => no_mutasi === noMut[i]))
            if (dataMut[index] !== undefined) {
                newMut.push(dataMut[index])
            }
        }
        this.setState({ newMut: newMut })
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
        this.getDataTrack()
    }

    getDetailDisposal = async (value) => {
        const { dataMut } = this.props.tracking
        const detail = []
        for (let i = 0; i < dataMut.length; i++) {
            if (dataMut[i].no_mutasi === value) {
                detail.push(dataMut[i])
            }
        }
        this.setState({detailMut: detail})
        this.openModalDis()
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }


    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, newMut, detailMut} = this.state
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
                                    <div className={style.titleDashboard}>Tracking Mutasi</div>
                                </div>
                                <div className={[style.secEmail]}>
                                    <div className="mt-5">
                                        <Input type="select" value={this.state.view} onChange={e => this.changeView(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="proses">On Proses</option>
                                            <option value="reject">Reject</option>
                                            <option value="selesai">Selesai</option>
                                        </Input>
                                    </div>
                                    <div className={[style.searchEmail]}>
                                        <text>Search: </text>
                                        <Input 
                                        className={style.search}
                                        onChange={this.onSearch}
                                        value={this.state.search}
                                        onKeyPress={this.onSearch}
                                        >
                                            <FaSearch size={20} />
                                        </Input>
                                    </div>
                                </div>
                                <Table bordered striped responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>NO</th>
                                            <th>NO.AJUAN</th>
                                            <th>AREA ASAL</th>
                                            <th>AREA TUJUAN</th>
                                            <th>TANGGAL SUBMIT</th>
                                            <th>STATUS</th>
                                            <th>OPSI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {newMut !== undefined && newMut.length > 0 && newMut.map(item => {
                                        return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                            <td>{newMut.indexOf(item) + 1}</td>
                                            <td>{item.no_mutasi}</td>
                                            <td>{item.area}</td>
                                            <td>{item.area_rec}</td>
                                            <td>{moment(item.tanggalMut).format('DD MMMM YYYY')}</td>
                                            <td>On Proses</td>
                                            <td>
                                                <Button className="btnSell" color="primary" onClick={() => {this.getDetailDisposal(item.no_mutasi)}}>Lacak</Button>
                                            </td>
                                        </tr>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                                {newMut.length === 0 ? (
                                    <div className={style.spin}>
                                        <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                {/* {newMut === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {newMut.length !== 0 && newMut.map(item => {
                                            return (
                                                newMut.length === 0 ? (
                                                    <div></div>
                                                ) : (
                                                    <div className="bodyCard">
                                                    <img src={placeholder} className="imgCard1" />
                                                    <Button size="sm" color="warning" className="labelBut">Mutasi</Button>
                                                    <div className="ml-2">
                                                        <div className="txtDoc mb-2">
                                                            Pengajuan Mutasi Asset
                                                        </div>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Area Asal
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                             <div>:</div>
                                                             {item.area}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Area Tujuan
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                             <div>:</div>
                                                             {item.area_rec}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            No Mutasi
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                             <div>:</div>
                                                             {item.no_mutasi}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Status Approval
                                                            </Col>
                                                            {item.status_form > 2 ? (
                                                                <Col md={6} className="txtDoc">
                                                                : Full Approve
                                                                </Col>
                                                            ) : ( 
                                                                item.appForm.find(({status}) => status === 0) !== undefined ? (
                                                                    <Col md={6} className="txtDoc">
                                                                     <div>:</div>
                                                                     Reject {item.appForm.find(({status}) => status === 0).jabatan}
                                                                    </Col>
                                                                ) : item.appForm.find(({status}) => status === 1) !== undefined ? (
                                                                    <Col md={6} className="txtDoc">
                                                                     <div>:</div>
                                                                     Approve {item.appForm.find(({status}) => status === 1).jabatan}
                                                                    </Col>
                                                                ) : (
                                                                    <Col md={6} className="txtDoc">
                                                                     <div>:</div>
                                                                     -
                                                                    </Col>
                                                                )
                                                            )}
                                                        </Row>
                                                    </div>
                                                    <Row className="footCard mb-3 mt-3">
                                                        <Col md={12} xl={12}>
                                                            <Button className="btnSell" color="primary" onClick={() => {this.getDetailDisposal(item.no_mutasi)}}>Lacak</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                )
                                            )
                                        })}
                                        </Row>
                                    )} */}
                                <div className='mt-4'>
                                    <div className={style.infoPageEmail1}>
                                        <text>Showing 1 of 1 pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.props.tracking.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formDis} toggle={() => {this.openModalDis(); this.showCollap('close')}} size="xl">
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={detailMut.find(({status_form}) => status_form === 26) === undefined ? false : true}>
                        <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                    </Alert> */}
                    <ModalBody>
                        <Row className='trackTitle ml-4'>
                            <Col>
                                Tracking Mutasi
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                                Area asal
                            </Col>
                            <Col md={9}>
                            : {detailMut[0] === undefined ? '' : detailMut[0].area}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                                Area tujuan
                            </Col>
                            <Col md={9}>
                            : {detailMut[0] === undefined ? '' : detailMut[0].area_rec}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                            No Mutasi
                            </Col>
                            <Col md={9}>
                            : {detailMut[0] === undefined ? '' : detailMut[0].no_mutasi}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub1'>
                            <Col md={3}>
                            Tanggal Pengajuan Mutasi
                            </Col>
                            <Col md={9}>
                            : {detailMut[0] === undefined ? '' : moment(detailMut[0].tanggalMut === null ? detailMut[0].createdAt : detailMut[0].tanggalMut).locale('idn').format('DD MMMM YYYY ')}
                            </Col>
                        </Row>
                        <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                            <div class="step completed">
                                <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Submit')} ><FiSend size={40} className="center1" /></button>
                                </div>
                                <h4 class="step-title">Submit Mutasi</h4>
                            </div>
                            <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form > 2 ? "step completed" : 'step'} >
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Pengajuan')}><MdAssignment size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Pengajuan Mutasi</h4>
                            </div> 
                            <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form >= 3 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Eksekusi')}><FiTruck size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Eksekusi Mutasi</h4>
                            </div>
                            {detailMut[0] === undefined ? (
                                <div></div>
                            ) : detailMut.find(({isbudget}) => isbudget === 'ya') && (
                                <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 7 && detailMut[0].status_form !== 9 && detailMut[0].status_form > 4 ? "step completed" : 'step'}>
                                    <div class="step-icon-wrap">
                                        <button class="step-icon" onClick={() => this.showCollap('Proses Budget')}><FiSettings size={40} className="center" /></button>
                                    </div>
                                    <h4 class="step-title">Proses Budget</h4>
                                </div>
                            )}
                            <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form === 8 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Selesai</h4>
                            </div>
                        </div>
                        <Collapse isOpen={this.state.collap} className="collapBody">
                            <Card className="cardCollap">
                                <CardBody>
                                    <div className='textCard1'>{this.state.tipeCol} Mutasi</div>
                                    {this.state.tipeCol === 'submit' ? (
                                        <div>Tanggal submit : {detailMut[0] === undefined ? '' : moment(detailMut[0].tanggalMut === null ? detailMut[0].createdAt : detailMut[0].tanggalMut).locale('idn').format('DD MMMM YYYY ')}</div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div>Rincian Asset:</div>
                                    <Table striped bordered responsive hover className="tableDis mb-3">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nomor Asset</th>
                                                <th>Nama Barang</th>
                                                <th>Merk/Type</th>
                                                <th>Kategori</th>
                                                <th>Nilai Buku</th>
                                                <th>Nilai Jual</th>
                                                <th>Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailMut.length !== 0 && detailMut.map(item => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{detailMut.indexOf(item) + 1}</th>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.nama_asset}</td>
                                                        <td>{item.merk}</td>
                                                        <td>{item.kategori}</td>
                                                        <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.keterangan}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {detailMut[0] === undefined || this.state.tipeCol === 'Submit' ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                            {this.state.tipeCol === 'Pengajuan' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    {detailMut[0] !== undefined && detailMut[0].appForm.length && detailMut[0].appForm.slice(0).reverse().map(item => {
                                                        return (
                                                            <div class={item.status === 1 ? 'step completed' : item.status === 0 ? 'step reject' : 'step'}>
                                                                <div class="step-icon-wrap">
                                                                <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                                </div>
                                                                <h5 class="step-title">{moment(item.updatedAt).format('DD-MM-YYYY')} </h5>
                                                                <h4 class="step-title">{item.jabatan}</h4>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) :  this.state.tipeCol === 'Eksekusi' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 2 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Check Dokumen Terima Mutasi</h4>
                                                    </div>
                                                    <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 2 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            ) : this.state.tipeCol === 'Proses Budget' && (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 3 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Proses Ubah Cost Center</h4>
                                                    </div>
                                                    <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 4  ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Proses SAP</h4>
                                                    </div>
                                                    <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 4 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Collapse>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailMut[0] !== undefined && detailMut[0].no_mutasi})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => {this.openModalDis(); this.showCollap('close')}}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen Eksekusi Mutasi
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
                                <Button color="success">Download</Button>
                            </div>
                        {level === '5' ? (
                            <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            ) : (
                                <div>
                                    <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button>
                                </div>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    setuju: state.setuju,
    pengadaan: state.pengadaan,
    tracking: state.tracking
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
    submitEksDisposal: setuju.submitEksDisposal,
    showDokumen: pengadaan.showDokumen,
    getTrack: tracking.getTrack,
    trackMutasi: tracking.trackMutasi
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackingMutasi)
