/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature, FaTh, FaList} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import {Form} from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import {connect} from 'react-redux'
import pengadaan from '../../redux/actions/pengadaan'
import dokumen from '../../redux/actions/dokumen'
import OtpInput from "react-otp-input";
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import renderHTML from 'react-render-html'
import ModalDokumen from '../../components/ModalDokumen'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

const alasanDisSchema = Yup.object().shape({
    alasan: Yup.string().required(),
    jenis_reject: Yup.string().required()
});

class Pengadaan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            openBid: false,
            dataBid: '',
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
            dropApp: false,
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
            rinciAdmin: false,
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 12,
            search: '',
            formDis: false,
            formTrack: false,
            openModalDoc: false,
            modalRinci: false,
            dataRinci: {},
            detailDis: [],
            nama: "Pilih Approval",
            openReject: false,
            openApprove: false,
            preview: false,
            openPdf: false,
            idDoc: 0,
            openApproveIo: false,
            openRejectDis: false,
            fileName: {},
            dataApp: {},
            img: '',
            limImage: 20000,
            submitPre: false,
            date: '',
            view: 'card',
            newDis: [],
            app: [],
            find: null,
            openModalIo: false,
            openModalTtd: false,
            profit: "",
            io: "",
            data: [],
            index: 0,
            rinciIo: {},
            total: 0,
            listMut: [],
            newIo: [],
            filter: 'available',
            isAppall: false,
            stat: '',
            listStat: [],
            url: '',
            valdoc: {},
            detailTrack: [],
            collap: false, 
            tipeCol: '',
            time: '',
            typeReject: '',
            menuRev: '',
            noDoc: '',
            noTrans: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }


    rejectApp = (val) => {
        this.setState({typeReject: val})
    }

    rejectRej = (val) => {
        const {typeReject} = this.state
        if (typeReject === val) {
            this.setState({typeReject: ''})
        }
    }

    menuApp = (val) => {
        this.setState({menuRev: val})
    }

    menuRej = (val) => {
        const {menuRev} = this.state
        if (menuRev === val) {
            this.setState({menuRev: ''})
        }
    }

    getApproveDis = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, value.no, value.nama)
    }

    statusApp = (val) => {
        const { listStat } = this.state
        listStat.push(val)
        this.setState({listStat: listStat})
    }

    statusRej = (val) => {
        const { listStat } = this.state
        const data = []
        for (let i = 0; i < listStat.length; i++) {
            if (listStat[i] === val) {
                data.push()
            } else {
                data.push(listStat[i])
            }
        }
        this.setState({listStat: data})
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    openRinciAdmin = () => {
        this.setState({rinciAdmin: !this.state.rinciAdmin})
    }

    openPreview = () => {
        this.setState({preview: !this.state.preview})
    }

    openModPreview = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveIo(token, val.no_pengadaan)
        this.openPreview()
    }

    onChange = value => {
        this.setState({value: value})
    }

    updateNomorIo = async (val) => {
        const {value} = this.state
        const token = localStorage.getItem('token')
        const data = {
            no_io: value
        }
        await this.props.updateNoIo(token, val, data)
        await this.props.getDetail(token, val)
        this.setState({confirm: 'isupdate'})
        this.openConfirm()
    }

    submitBudget = async () => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        const cek = []
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].no_io === null || detailIo[i].no_io === '') {
                cek.push(detailIo[i])  
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
        } else {
            await this.props.submitBudget(token, detailIo[0].no_pengadaan)
            this.prosesModalIo()
            this.getDataAsset()
            this.setState({confirm: 'submit'})
            this.openConfirm()
        }
    }

    goCartTicket = () => {
        this.props.history.push('/carttick')
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    updateIo = async (val) => {
        const token = localStorage.getItem('token')
        const data = {
            isAsset: val.value
        }
        await this.props.updateDataIo(token, val.item.id, data)
        await this.props.getDetail(token, val.item.no_pengadaan)
    }

    openModalApproveIo = () => {
        this.setState({openApproveIo: !this.state.openApproveIo})
    }

    cekProsesApprove = async () => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const {detailIo} = this.props.pengadaan
        
        if ((level === '5' || level === '9') && (detailIo[0].alasan === '' || detailIo[0].alasan === null || detailIo[0].alasan === '-')) {
            this.setState({confirm: 'recent'})
            this.openConfirm()
        } else if (level !== '5' && level !== '9') {
            if (detailIo[0].asset_token === null) {
                const tempdoc = []
                const arrDoc = []
                for (let i = 0; i < detailIo.length; i++) {
                    await this.props.getDocCart(token, detailIo[i].id)
                    const {dataDocCart} = this.props.pengadaan
                    for (let j = 0; j < dataDocCart.length; j++) {
                        if (dataDocCart[j].path !== null) {
                            const arr = dataDocCart[j]
                            const stat = arr.status_dokumen
                            const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : ''
                            const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : ''
                            if (cekLevel === ` level ${level}` && cekStat === ` status approve`) {
                                tempdoc.push(arr)
                                arrDoc.push(arr)
                            } else {
                                arrDoc.push(arr)
                            }
                        }
                    }
                }
                if (tempdoc.length === arrDoc.length) {
                    this.openModalApproveIo()
                } else {
                    this.setState({confirm: 'falseAppDok'})
                    this.openConfirm()
                }
            } else {
                const {dataDoc} = this.props.pengadaan
                const tempdoc = []
                const arrDoc = []
                for (let j = 0; j < dataDoc.length; j++) {
                    if (dataDoc[j].path !== null) {
                        const arr = dataDoc[j]
                        const stat = arr.status_dokumen
                        const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : ''
                        const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : ''
                        if (cekLevel === ` level ${level}` && cekStat === ` status approve`) {
                            tempdoc.push(arr)
                            arrDoc.push(arr)
                        } else {
                            arrDoc.push(arr)
                        }
                    }
                }
                if (tempdoc.length === arrDoc.length) {
                    this.openModalApproveIo()
                } else {
                    this.setState({confirm: 'falseAppDok'})
                    this.openConfirm()
                }
            }
        } else {
            this.openModalApproveIo()
        }
    }

    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalReject = () => {
        const level = localStorage.getItem('level')
        const {detailIo} = this.props.pengadaan
        if ((level === '5' || level === '9') && (detailIo[0].alasan === '' || detailIo[0].alasan === null || detailIo[0].alasan === '-')) {
            this.setState({confirm: 'recent'})
            this.openConfirm()
        } else {
            this.setState({listStat: [], openReject: !this.state.openReject})
        }
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    prosesModalDoc = async (val) => {
        const data = this.props.pengadaan.detailIo
        const token = localStorage.getItem('token')
        this.setState({valdoc: val})
        
        if (val.asset_token === null || val.asset_token === '') {
            const tempno = {
                no: val.id,
                jenis: 'pengadaan'
            }
            await this.props.getDokumen(token, tempno)
            await this.props.getDocCart(token, val.id)
            this.setState({noDoc: val.id, noTrans: data[0].no_pengadaan})
            this.closeProsesModalDoc()
        } else {
            const tempno = {
                no: data[0].no_pengadaan,
                jenis: 'pengadaan'
            }
            await this.props.getDokumen(token, tempno)
            await this.props.getDocumentIo(token, data[0].no_pengadaan)
            this.setState({noDoc: data[0].no_pengadaan, noTrans: data[0].no_pengadaan})
            this.closeProsesModalDoc()
        }
    }

    prosesDoc = async (val) => {
        const data = this.props.pengadaan.detailIo
        const token = localStorage.getItem('token')
        if (val.asset_token === null || val.asset_token === '') {
            this.props.getDocCart(token, val.id)
        } else {
            await this.props.getDocumentIo(token, data[0].no_pengadaan)
        }
    }

    approveDokumen = async () => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveDocument(token, fileName.id)
        this.setState({openApprove: !this.state.openApprove})
        this.setState({openPdf: false, openBid: false})
    }

    rejectDokumen = async (value) => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        this.setState({openRejectDis: !this.state.openRejectDis})
        await this.props.rejectDocument(token, fileName.id, value)
        this.setState({openPdf: false, openBid: false})
    }

    rejectIo = async (value) => {
        const { detailIo } = this.props.pengadaan
        const level = localStorage.getItem('level')
        const {listStat, listMut, typeReject, menuRev} = this.state
        const token = localStorage.getItem('token')
        let temp = ''
        let status = ''
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.'
        }
        const data = {
            alasan: temp + value.alasan,
            status: parseInt(status),
            no: detailIo[0].no_pengadaan,
            menu: menuRev,
            list: listMut,
            type: level === '2' || level === '8' ? 'verif' : 'form',
            type_reject: typeReject
        }
        this.openModalReject()
        await this.props.rejectIo(token, detailIo[0].no_pengadaan, data)
        this.getDataAsset()
    }


    approveIo = async () => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        this.openModalApproveIo()
        await this.props.approveIo(token, detailIo[0].no_pengadaan)
        this.getDataAsset()
    }

    submitAsset = async (val) => {
        const token = localStorage.getItem('token')
        const dataFalse = []
        const cek = []
        const cekDok = []
        const { detailIo } = this.props.pengadaan
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].isAsset !== 'true' && detailIo[i].isAsset !== 'false') {
                cek.push(detailIo[i])  
            } else if (detailIo[i].isAsset === 'false') {
                dataFalse.push(detailIo[i])
            } else if (detailIo[i].asset_token === null) {
                await this.props.getDocCart(token, detailIo[i].id)
                const {dataDocCart} = this.props.pengadaan
                if (dataDocCart.find(({status}) => status === null) || dataDocCart.find(({status}) => status === 0)) {
                    cekDok.push(dataDocCart)
                }
            } else if (detailIo[i].asset_token !== null) {
                await this.props.getDocumentIo(token, detailIo[i].no_pengadaan)
                const {dataDoc} = this.props.pengadaan
                if (dataDoc.find(({status}) => status === null) || dataDoc.find(({status}) => status === 0)) {
                    cekDok.push(dataDoc)
                }
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'falseSubmit'})
            this.openConfirm()
        } else if (cekDok.length > 0) {
            this.setState({confirm: 'falseSubmitDok'})
            this.openConfirm()
        } else {
            if (dataFalse.length === detailIo.length) {
                await this.props.submitNotAsset(token, val)
                await this.props.podsSend(token, val)
                this.getDataAsset()
                this.prosesModalIo()
                this.setState({confirm: 'submitnot'})
                this.openConfirm()
            } else {
                await this.props.submitIsAsset(token, val)
                this.getDataAsset()
                this.prosesModalIo()
                this.setState({confirm: 'submit'})
                this.openConfirm()
            }
        }
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            // this.getDataList()
        } else {
            // this.getDataStock()
        }
    }

    openForm = async (val) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getDetail(token, val.no_pengadaan)
        await this.props.getApproveIo(token, val.no_pengadaan)
        const data = this.props.pengadaan.detailIo
        let num = 0
        for (let i = 0; i < data.length; i++) {
            if (data[i].isAsset !== 'true' && level !== '2' ) {
                const temp = 0
                num += temp
            } else {
                const temp = parseInt(data[i].price) * parseInt(data[i].qty)
                num += temp
            }
        }
        this.setState({total: num, value: data[0].no_io})
        this.prosesModalIo()
    }

    rejectDisposal = async (value) => {
        const token = localStorage.getItem('token')
        const data = {
            alasan: value.value.alasan
        }
        if (value.value.jenis_reject === 'batal') {
            this.openModalDis()
        } 
        await this.props.rejectDisposal(token, value.no, data, value.value.jenis_reject)
        this.openModalReject()
        this.getDataDisposal()
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    prosesModalIo = () => {
        this.setState({openModalIo: !this.state.openModalIo})
    }

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.disposal
        const detail = []
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].no_disposal === value) {
                detail.push(dataDis[i])
            }
        }
        this.setState({detailDis: detail})
        this.openModalDis()
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    updateAlasan = async (val) => {
        const token = localStorage.getItem('token')
        const {detailIo} = this.props.pengadaan
        await this.props.updateRecent(token, detailIo[0].no_pengadaan, val)
        await this.props.getDetail(token, detailIo[0].no_pengadaan)
        this.setState({confirm: 'upreason'})
        this.openConfirm()
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/dokumen.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "dokumen.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropApp = () => {
        this.setState({dropApp: !this.state.dropApp})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }
    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    addDokumen = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDokumen(token, values)
        const {isAdd} = this.props.asset
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            setTimeout(() => {
                this.getDataAsset()
            }, 500)
        }
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        const data = this.props.pengadaan.detailIo
        await this.props.showDokumen(token, value.id, value.no_pengadaan)
        const {isShow} = this.props.pengadaan
        if (isShow) {
            this.prosesDoc(data)
            this.openModalPdf()
        }
    }

    showDokPods = async (val) => {
        this.setState({date: val.updatedAt, idDoc: val.id, fileName: val})
        const data = this.props.pengadaan.detailIo
        const url = val.path
        const cekBidding = url.search('bidding')
        if (cekBidding !== -1) {
            this.setState({dataBid: url})
            this.openModalBidding()
        } else {
            window.open(url, '_blank')
            this.prosesDoc(data)
            this.openModalPdf()
        }
    }

    openModalBidding = () => {
        this.setState({openBid: !this.state.openBid})
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
        // const cek = download[2].split('.')
        // const arr = fileName.path.split('localhost:8000')
        // if (arr.length >= 2) {
        //     const urln = 'https://devpods.pinusmerahabadi.co.id' + arr[1]
        //     console.log(urln)
        //     axios({
        //         url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        //         method: 'GET',
        //         responseType: 'blob', // important
        //     }).then((response) => {
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.setAttribute('download', `${fileName.nama_dokumen}`); //or any other extension
        //         document.body.appendChild(link);
        //         link.click();
        //     });
        // } else {
        //     axios({
        //         url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
        //         method: 'GET',
        //         responseType: 'blob', // important
        //     }).then((response) => {
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.setAttribute('download', `${fileName.nama_dokumen}.${cek[1]}`); //or any other extension
        //         document.body.appendChild(link);
        //         link.click();
        //     });
        // }
    }


    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    approveAll = async () => {
        const {newIo, listMut} = this.state
        const token = localStorage.getItem('token')
        const data = []
        for (let i = 0; i < newIo.length; i++) {
            for (let j = 0; j < listMut.length; j++) {
                if (newIo[i].id === listMut[j]) {
                    data.push(newIo[i].no_pengadaan)
                }
            }
        }
        await this.props.approveAll(token, data)
        this.openAppall()
    }

    getDetailTrack = async (value) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getDetail(token, value)
        await this.props.getApproveIo(token, value)
        const data = this.props.pengadaan.detailIo
        const detail = []
        let num = 0
        for (let i = 0; i < data.length; i++) {
            const temp = parseInt(data[i].price) * parseInt(data[i].qty)
            num += temp
            detail.push(data[i])
        }
        this.setState({total: num, value: data[0].no_io})
        this.setState({detailTrack: detail})
        this.openModalTrack()
    }

    openModalTrack = () => {
        this.setState({formTrack: !this.state.formTrack})
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

    goDownload = (val) => {
        const {detailIo} = this.props.pengadaan
        localStorage.setItem('printData', detailIo[0].no_pengadaan)
        const newWindow = window.open(`/${val}`, '_blank', 'noopener,noreferrer')
        if (newWindow) {
            newWindow.opener = null
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isUpdate, approve, rejApprove, reject, rejReject, detailIo, testPods, appdoc, rejdoc} = this.props.pengadaan
        const {rinciIo, listMut, newIo} = this.state
        const token = localStorage.getItem('token')
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, rinciIo.no_pengadaan)
             }, 2100)
        } else if (isUpdate) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, rinciIo.no_pengadaan)
             }, 2100)
        } else if (approve) {
            this.setState({confirm: 'approve'})
            this.openConfirm()
            this.props.resetApp()
            this.prosesModalIo()
            this.props.getApproveIo(token, detailIo[0].no_pengadaan)
        } else if (rejApprove) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.props.resetApp()
        } else if (reject) {
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.props.resetApp()
            this.prosesModalIo()
            this.props.getApproveIo(token, detailIo[0].no_pengadaan)
        } else if (rejReject) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.props.resetApp()
        } else if (listMut.length > newIo.length) {
            this.setState({listMut: []})
        } else if (testPods === 'true') {
            this.setState({confirm: 'apitrue'})
            this.openConfirm()
            this.props.resetApp()
        } else if (testPods === 'false') {
            this.setState({confirm: 'apifalse'})
            this.openConfirm()
            this.props.resetApp()
        } else if (appdoc === true) {
            this.setState({confirm: 'appDocTrue'})
            this.openConfirm()
            this.props.resetApp()
            this.prosesDoc(this.state.valdoc)
        } else if (appdoc === false) {
            this.setState({confirm: 'appDocFalse'})
            this.openConfirm()
            this.props.resetApp()
        } else if (rejdoc === true) {
            this.setState({confirm: 'rejDocTrue'})
            this.openConfirm()
            this.props.resetApp()
            this.prosesDoc(this.state.valdoc)
        } else if (rejdoc === false) {
            this.setState({confirm: 'rejDocFalse'})
            this.openConfirm()
            this.props.resetApp()
        }
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            // await this.props.getAsset(token, 10, e.target.value, 1)
            // this.getDataAsset({limit: 10, search: this.state.search})
        }
    }

    goSetDispos = async () => {
        const token = localStorage.getItem("token")
        await this.props.submitSetDisposal(token)
        this.modalSubmitPre()
        this.getDataDisposal()
    }
    
    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    componentDidMount() {
        // this.getNotif()
        this.getDataAsset()
    }

    getDataAsset = async (value) => {
        const level = localStorage.getItem('level')
        const status = level === '2' ? '1' : level === '8' ? '3' : 'all'
        const token = localStorage.getItem("token")
        await this.props.getPengadaan(token, status)
        this.changeFilter(status === 'all' && (level !== '5' && level !== '9') ? 'all' : 'available')
    }

    getDataMount = () => {
        this.changeFilter('available')
    }

    openAppall = () => {
        this.setState({isAppall: !this.state.isAppall})
    }

    changeFilter = async (val) => {
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')

        const status = val === 'available' && level === '2' ? '1' : val === 'available' && level === '8' ? '3' : 'all'
        const token = localStorage.getItem("token")
        await this.props.getPengadaan(token, status)

        if (level === '2' || level === '8') {
            const {dataPeng} = this.props.pengadaan
            this.setState({filter: val, newIo: dataPeng})
        } else {
            const {dataPeng} = this.props.pengadaan
            if (val === 'available' && dataPeng.length > 0) {
                console.log('at available')
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    const app = dataPeng[i].appForm ===  undefined ? [] : dataPeng[i].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    if (level === '5' || level === '9') {
                        console.log('at available 2')
                        console.log(app[find].status === null)
                        if (dataPeng[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
                            console.log('at available 3')
                            newIo.push(dataPeng[i])
                        } else if (dataPeng[i].status_form === '2' && app[find].status === null ) {
                            console.log('at available 4')
                            newIo.push(dataPeng[i])
                        }
                    } else if (find === 0 || find === '0') {
                        console.log('at available 8')
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            newIo.push(dataPeng[i])
                        }
                    } else {
                        console.log('at available 5')
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newIo.push(dataPeng[i])
                        }
                    }
                }
                this.setState({filter: val, newIo: newIo})
            } else if (val === 'reject' && dataPeng.length > 0) {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    if (dataPeng[i].status_reject === 1) {
                        newIo.push(dataPeng[i])
                    }
                }
                this.setState({filter: val, newIo: newIo})
            } else if (val === 'selesai' && dataPeng.length > 0) {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    if (dataPeng[i].status_form === 8) {
                        newIo.push(dataPeng[i])
                    }
                }
                this.setState({filter: val, newIo: newIo})
            } else {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    const app = dataPeng[i].appForm ===  undefined ? [] : dataPeng[i].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    if (level === '5' || level === '9') {
                        if (dataPeng[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
                            console.log('at all 3')
                            newIo.push()
                        } else if (dataPeng[i].status_form === '2' && app[find].status === null ) {
                            console.log('at all 4')
                            newIo.push()
                        } else {
                            newIo.push(dataPeng[i])
                        }
                    } else if (find === 0 || find === '0') {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            newIo.push()
                        } else {
                            newIo.push(dataPeng[i])
                        }
                    } else {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newIo.push()
                        } else {
                            newIo.push(dataPeng[i])
                        }
                    }
                }
                this.setState({filter: val, newIo: newIo})
            }
        }
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    testConnect = async () => {
        const token = localStorage.getItem("token")
        await this.props.testApiPods(token)
    }

    getSubmitDisposal = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.disposal
        await this.props.getSubmitDisposal(token, 1000, '', page.currentPage, 9)
        this.modalSubmitPre()
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    addDisposal = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.addDisposal(token, value)
        this.getDataAsset()
    }

    addSell = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.addSell(token, value)
        this.getDataAsset()
    }

    openDataRinci = (val) => {
        this.setState({dataRinci: val})
        const role = localStorage.getItem('role')
        const app = val.appForm
        const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
        this.setState({app: app, find: find})
        this.openRinciAdmin()
    }

    chekApp = (val) => {
        const { listMut, newIo } = this.state
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newIo.length; i++) {
                data.push(newIo[i].id)
            }
            this.setState({listMut: data})
        } else {
            listMut.push(val)
            this.setState({listMut: listMut})
        }
    }

    chekRej = (val) => {
        const { listMut } = this.state
        if (val === 'all') {
            const data = []
            this.setState({listMut: data})
        } else {
            const data = []
            for (let i = 0; i < listMut.length; i++) {
                if (listMut[i] === val) {
                    data.push()
                } else {
                    data.push(listMut[i])
                }
            }
            this.setState({listMut: data})
        }
    }

    changeTime = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({time: val})
        if (val === 'all') {
            this.setState({time1: '', time2: ''})
            setTimeout(() => {
                this.getDataTime()
             }, 500)
        }
    }

    render() {
        const {alert, upload, errMsg, rinciIo, total, listMut, newIo, listStat, fileName, url, detailTrack, sidebarOpen} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const {dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataDocCart} = this.props.pengadaan
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data
        const role = localStorage.getItem('role')

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                    href="#"
                    onClick={this.menuButtonClick}
                    >
                    <FaBars size={20} className={style.white} />
                </NavbarBrand>
                <NavBar dataNotif={dataNotif} />
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
                {/* <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Pengadaan Asset</div>
                                </div>
                                <div className={style.secEmail}>
                                    {level === '5' || level === '9' ? (
                                        <div className={style.headEmail}>
                                            <Button size="lg" color='info' onClick={this.goCartTicket}>Create</Button>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className='rowCenter'>
                                        <text>Filter: </text>
                                        <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="available">Available To Approve</option>
                                            <option value="reject">Reject</option>
                                            <option value="completed">Selesai</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className='rowCenter'>
                                        <div className='rowCenter'>
                                            <Input className={style.filter3} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                                <option value="all">Time (All)</option>
                                                <option value="pilih">Periode</option>
                                            </Input>
                                        </div>
                                        {this.state.time === 'pilih' ?  (
                                            <>
                                                <div className='rowCenter'>
                                                    <text className='bold'>:</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time1}
                                                        onChange={e => this.selectTime({val: e.target.value, type: 'time1'})}
                                                    />
                                                    <text className='mr-1 ml-1'>To</text>
                                                    <Input
                                                        type= "date" 
                                                        className="inputRinci"
                                                        value={this.state.time2}
                                                        onChange={e => this.selectTime({val: e.target.value, type: 'time2'})}
                                                    />
                                                    <Button
                                                    disabled={this.state.time1 === '' || this.state.time2 === '' ? true : false} 
                                                    color='primary' 
                                                    onClick={this.getDataTime} 
                                                    className='ml-1'>
                                                        Go
                                                    </Button>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className={style.searchEmail2}>
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
                                <div>
                                    <Table bordered striped responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>NO AJUAN</th>
                                                <th>KODE AREA</th>
                                                <th>NAMA AREA</th>
                                                <th>TANGGAL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {newIo.length > 0 && newIo.map(item => {
                                            return (
                                                <tr>
                                                    <td>{newIo.indexOf(item) + 1}</td>
                                                    <td>{item.no_pengadaan}</td>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}</td>
                                                    <td>{moment(item.tglIo).format('DD MMMM YYYY')}</td>
                                                    <td>{item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                                    <td>
                                                        <Button color='primary' className='mr-1 mb-1' onClick={() => this.openForm(item)}>{this.state.filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                        <Button color='warning' onClick={() => this.getDetailTrack(item.no_pengadaan)}>Tracking</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                    {newIo.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Pengadaan Aset</h2>
                        {(level === '5' || level === '9' ) && (
                            <div className={styleTrans.searchContainer}>
                                <Button size="lg" color='primary' onClick={this.goCartTicket}>Create</Button>
                            </div>
                        )}
                        <div className={styleTrans.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="available">Available To Approve</option>
                                <option value="reject">Reject</option>
                                <option value="completed">Selesai</option>
                            </select>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO AJUAN</th>
                                    <th>KODE AREA</th>
                                    <th>NAMA AREA</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newIo.length > 0 && newIo.map(item => {
                                    return (
                                        <tr>
                                            <td>{newIo.indexOf(item) + 1}</td>
                                            <td>{item.no_pengadaan}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}</td>
                                            <td>{moment(item.tglIo).format('DD MMMM YYYY')}</td>
                                            <td>{item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                            <td>
                                                <Button color='primary' className='mr-1 mb-1' onClick={() => this.openForm(item)}>{this.state.filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                <Button color='warning' onClick={() => this.getDetailTrack(item.no_pengadaan)}>Tracking</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {newIo.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal size="xl" isOpen={this.state.openModalIo} toggle={this.prosesModalIo}>
                <ModalBody className="mb-5">
                    <Container>
                        <Row className="rowModal">
                            <Col md={3} lg={3}>
                                <img src={logo} className="imgModal" />
                            </Col>
                            <Col md={9} lg={9}>
                                <text className="titModal">FORM INTERNAL ORDER ASSET</text>
                            </Col>
                        </Row>
                        <div className="mt-4 mb-3">Io type:</div>
                        <div className="mb-4">
                            <Form.Check 
                                type="checkbox"
                                checked
                                label="CB-20 IO Capex"
                            />
                        </div>
                        <Row className="rowModal">
                            <Col md={2} lg={2}>
                                Nomor IO
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={this.state.value}
                                onChange={this.onChange}
                                numInputs={11}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                                isDisabled={level === '8' ? false : true}
                            />
                            {level === '8' && (
                                <Button className='ml-3' size='sm' color='success' onClick={() => this.updateNomorIo(detailIo[0].no_pengadaan)}>Save</Button>
                            )}
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col md={2} lg={2}>
                                Deskripsi
                            </Col>
                            <Col md={10} lg={10} className="colModalTab">
                                <text className="mr-3">:</text>
                                <Table bordered stripped responsive>
                                    <thead>
                                        <tr>
                                            <th>
                                                <Input 
                                                addon
                                                type="checkbox"
                                                className='mr-3'
                                                disabled={this.state.filter === 'not available' ? true : false}
                                                checked={listMut.length === 0 ? false : listMut.length === newIo.length ? true : false}
                                                onClick={listMut.length === newIo.length ? () => this.chekRej('all') : () => this.chekApp('all')}
                                                />
                                                Select All
                                            </th>
                                            <th>Qty</th>
                                            <th>Description</th>
                                            <th>Price/unit</th>
                                            <th>Total Amount</th>
                                            {/* <th>OPSI</th> */}
                                            {level === '2' && (
                                                <th>Asset</th>
                                            )}
                                            {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                                <th>Dokumen</th>
                                            ) : (
                                                null
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailIo !== undefined && detailIo.length > 0 && detailIo.map(item => {
                                            return (
                                                item.isAsset === 'false' && level !== '2' ? (
                                                    null
                                                ) : (
                                                    <tr >
                                                        <td>
                                                            <Input 
                                                            addon
                                                            type="checkbox"
                                                            className=''
                                                            disabled={this.state.filter === 'not available' ? true : false}
                                                            checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                            onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                            />
                                                        </td>
                                                        <td>{item.qty}</td>
                                                        <td>{item.nama}</td>
                                                        <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        {/* <td><Button onClick={() => this.openModalRinci()}>Detail</Button></td> */}
                                                        {level === '2' && (
                                                            <td className='colTable'>
                                                                <div>
                                                                    <Input
                                                                    addon
                                                                    disabled={item.status_app === null ? false : true}
                                                                    checked={item.isAsset === 'true' ? true : false}
                                                                    type="checkbox"
                                                                    onClick={() => this.updateIo({item: item, value: 'true'})}
                                                                    value={item.no_asset} />
                                                                    <text className='ml-2'>Ya</text>
                                                                </div>
                                                                <div>
                                                                    <Input
                                                                    addon
                                                                    disabled={item.status_app === null ? false : true}
                                                                    checked={item.isAsset === 'false' ? true : false}
                                                                    type="checkbox"
                                                                    onClick={() => this.updateIo({item: item, value: 'false'})}
                                                                    value={item.no_asset} />
                                                                    <text className='ml-2'>Tidak</text>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                                            <td>
                                                                <Button color='success' size='sm' onClick={() => this.prosesModalDoc(item)}>Show Dokumen</Button>
                                                            </td>
                                                        ) : (
                                                            null
                                                        )}
                                                    </tr>
                                                )
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Cost Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.cost_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-2">
                            <Col md={2} lg={2}>
                                Profit Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.profit_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Kategori
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Budget"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Non Budgeted"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'non-budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Return"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'return' ? true : false}
                                    />
                                </Col>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Amount
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>Rp {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
                            </Col>
                        </Row>
                        <Formik
                            initialValues={{
                            alasan: detailIo[0] === undefined ? '' : detailIo[0].alasan === null || detailIo[0].alasan === '' || detailIo[0].alasan === '-' ? '' : detailIo[0].alasan,
                            }}
                            validationSchema={alasanSchema}
                            onSubmit={(values) => {this.updateAlasan(values)}}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                    <div>
                                        <Row className="rowModal mt-4">
                                            <Col md={2} lg={2}>
                                                Alasan
                                            </Col>
                                            <Col md={10} lg={10} className="colModal">
                                            <text className="mr-3">:</text>
                                            {level === '5' || level === '9' ? (
                                                <>
                                                    <Input 
                                                        type='textarea'
                                                        name='alasan'
                                                        className='inputRecent'
                                                        value={values.alasan}
                                                        onChange={handleChange('alasan')}
                                                        onBlur={handleBlur('alasan')} 
                                                    />
                                                </>
                                            ) : (
                                                <text>{detailIo[0] === undefined ? '-' : detailIo[0].alasan}</text>
                                            )}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2} lg={2}></Col>
                                            <Col md={10} lg={10} >
                                                <text className="mr-3"></text>
                                                {errors.alasan ? (
                                                    <text className={style.txtError}>Must be filled</text>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        {this.state.filter === 'available' ? (
                                            <Row className="rowModal mt-1">
                                                <Col md={2} lg={2}>
                                                </Col>
                                                <Col md={10} lg={10} className="colModal1">
                                                <text className="mr-3"></text>
                                                {level === '5' || level === '9' ? (
                                                    <Button onClick={handleSubmit} color='success'>Update</Button>
                                                ) : (
                                                    null
                                                )}
                                                </Col>
                                            </Row>
                                        ) : (
                                            <Row></Row>
                                        )}
                                        
                                    </div>
                                )}
                        </Formik>
                    </Container>
                </ModalBody>
                <hr />
                <div className="modalFoot">
                    <div className="btnFoot">
                        {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                            null
                        ) : (
                            <Button className="ml-4" color="info" onClick={this.prosesModalDoc}>
                                Dokumen 
                            </Button>
                        )}
                        <Button className="ml-2" color="warning" onClick={() => this.openModPreview(detailIo[0])}>
                            Download Form
                        </Button>
                    </div>
                    {level === '2' || level === '8' && this.state.filter === 'available' ? (
                        <div className="btnFoot">
                            <Button className="mr-2" color="danger" disabled={listMut.length === 0 ? true : false} onClick={this.openModalReject}>
                                Reject 
                            </Button>
                            <Button disabled={detailIo.find((item) => item.isAsset === 'false') !== undefined ? true : false} color="success" onClick={level === '2' ? () => this.submitAsset(detailIo[0].no_pengadaan) : this.submitBudget}>
                                Submit
                            </Button>
                        </div>
                    ) : (
                    this.state.filter === 'available' ? (
                        <div className="btnFoot">
                            <Button className="mr-2" color="danger" disabled={listMut.length === 0 ? true : false} onClick={this.openModalReject}>
                                Reject..
                            </Button>
                            <Button  color="primary" onClick={this.cekProsesApprove}>
                                Approve..
                            </Button>
                        </div>
                    ) : (
                        <div></div>
                    )
                    )}
                </div>
            </Modal>
            <Modal size="xl" isOpen={this.state.preview} toggle={this.openPreview}>
                <ModalBody className="mb-5">
                    <Container className='mb-4'>
                        <Row className="rowModal">
                            <Col md={3} lg={3}>
                                <img src={logo} className="imgModal" />
                            </Col>
                            <Col md={9} lg={9}>
                                <text className="titModal">FORM INTERNAL ORDER ASSET</text>
                            </Col>
                        </Row>
                        <div className="mt-4 mb-3">Io type:</div>
                        <div className="mb-4">
                            <Form.Check 
                                checked
                                type="checkbox"
                                label="CB-20 IO Capex"
                            />
                        </div>
                        <Row className="rowModal">
                            <Col md={2} lg={2}>
                                Nomor IO
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={this.state.value}
                                onChange={this.onChange}
                                numInputs={11}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                                isDisabled
                            />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col md={2} lg={2}>
                                Deskripsi
                            </Col>
                            <Col md={10} lg={10} className="colModalTab">
                                <text className="mr-3">:</text>
                                <Table bordered stripped responsive>
                                    <thead>
                                        <tr>
                                            <th>Qty</th>
                                            <th>Description</th>
                                            <th>Price/unit</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailIo !== undefined && detailIo.length > 0 && detailIo.map(item => {
                                            return (
                                                item.isAsset === 'false' && level !== '2' ? (
                                                    null
                                                ) : (
                                                <tr onClick={() => this.openModalRinci()}>
                                                    <td>{item.qty}</td>
                                                    <td>{item.nama}</td>
                                                    <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>Rp {(parseInt(item.price) * parseInt(item.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."))}</td>
                                                </tr>
                                                )
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Cost Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.cost_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-2">
                            <Col md={2} lg={2}>
                                Profit Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.profit_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Kategori
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Budget"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Non Budgeted"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'non-budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Return"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'return' ? true : false}
                                    />
                                </Col>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Amount
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>Rp {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Alasan
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>{detailIo[0] === undefined ? '-' : detailIo[0].alasan}</text>
                            </Col>
                        </Row>
                    </Container>
                    <Table borderless responsive className="tabPreview">
                        <thead>
                            <tr>
                                <th className="buatPre">Dibuat oleh,</th>
                                <th className="buatPre">Diperiksa oleh,</th>
                                <th className="buatPre">Disetujui oleh,</th>
                            </tr>
                        </thead>
                        <tbody className="tbodyPre">
                            <tr>
                                <td className="restTable">
                                    <Table bordered responsive className="divPre">
                                        <thead>
                                            <tr>
                                                {dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                                                    return (
                                                        <th className="headPre">
                                                            <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                            <div>{item.nama === null ? "-" : item.nama}</div>
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            {dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'area' ? 'AOS' : item.jabatan}</td>
                                                )
                                            })}
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                                <td className="restTable">
                                    <Table bordered responsive className="divPre">
                                        <thead>
                                            <tr>
                                                {dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map(item => {
                                                    return (
                                                        <th className="headPre">
                                                            <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                            <div>{item.nama === null ? "-" : item.nama}</div>
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'ROM' ? 'OM' : item.jabatan}</td>
                                                    )
                                                })}
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                                <td className="restTable">
                                    <Table bordered responsive className="divPre">
                                        <thead>
                                            <tr>
                                                {dataApp.penyetuju !== undefined && dataApp.penyetuju.map(item => {
                                                    return (
                                                        <th className="headPre">
                                                            <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                            <div>{item.nama === null ? "-" : item.nama}</div>
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {dataApp.penyetuju !== undefined && dataApp.penyetuju.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                    )
                                                })}
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </ModalBody>
                <hr />
                <div className="modalFoot">
                    <div className="btnFoot">
                    </div>
                    <div className="btnFoot">
                        <Button className="mr-2" color="warning" onClick={() => this.goDownload('formio')}>
                            Download
                        </Button>
                        <Button color="secondary" onClick={this.openPreview}>
                            Close 
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal>
                <ModalBody>
                    
                </ModalBody>
            </Modal>
            <Modal size="md" isOpen={this.state.openModalTtd} toggle={this.prosesModalTtd}>
                <ModalHeader>
                    Proses Tanda Tangan
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={3} lg={3}>
                            Nama
                        </Col>
                        <Col md={9} lg={9}>
                            : <input />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.prosesModalTtd}>
                        Close
                    </Button>
                    <Button color="primary" onClick={this.prosesModalTtd}>
                        Save 
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalDokumen  
                    parDoc={{noDoc: this.state.noDoc, noTrans: this.state.noTrans, tipe: 'pengadaan', filter: this.state.filter}} 
                    dataDoc={detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? dataDocCart : dataDoc } 
                />
            </Modal>
            <Modal size="xl">
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Alert color="danger" className="alertWrong" isOpen={this.state.upload}>
                            <div>{this.state.errMsg}</div>
                        </Alert>
                        {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                            dataDocCart !== undefined && dataDocCart.map(x => {
                                return (
                                    <Row className="mt-3 mb-4">
                                        <Col md={12} lg={12} >
                                            <text>{dataDocCart.indexOf(x) + 1}. {x.nama_dokumen}</text>
                                        </Col>
                                        {x.path !== null ? (
                                            <Col md={12} lg={12} >
                                                {x.status === 0 ? (
                                                    <AiOutlineClose size={20} />
                                                ) : x.status === 3 ? (
                                                    <AiOutlineCheck size={20} />
                                                ) : (
                                                    <BsCircle size={20} />
                                                )}
                                                <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                                {/* <div>
                                                    <input
                                                    // className="ml-4"
                                                    type="file"
                                                    onClick={() => this.setState({detail: x})}
                                                    onChange={this.onChangeUpload}
                                                    />
                                                </div> */}
                                            </Col>
                                        ) : (
                                            <Col md={12} lg={12} >
                                                -
                                            </Col>
                                        )}
                                    </Row>
                                )
                            })
                        ) : (
                            dataDoc !== undefined && dataDoc.map(x => {
                                return (
                                    <Row className="mt-3 mb-4">
                                        <Col md={12} lg={12} >
                                            <text>{dataDoc.indexOf(x) + 1}. {x.nama_dokumen}</text>
                                        </Col>
                                        {x.path !== null ? (
                                            <Col md={12} lg={12} >
                                                {x.status === 0 ? (
                                                    <AiOutlineClose size={20} />
                                                ) : x.status === 3 ? (
                                                    <AiOutlineCheck size={20} />
                                                ) : (
                                                    <BsCircle size={20} />
                                                )}
                                                <button className="btnDocIo" onClick={() => this.showDokPods(x)} >{x.nama_dokumen}</button>
                                                {/* <div>
                                                    <input
                                                    // className="ml-4"
                                                    type="file"
                                                    onClick={() => this.setState({detail: x})}
                                                    onChange={this.onChangeUpload}
                                                    />
                                                </div> */}
                                            </Col>
                                        ) : (
                                            <Col md={12} lg={12} >
                                                -
                                            </Col>
                                        )}
                                    </Row>
                                )
                            })
                        )}
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
            <Modal isOpen={this.props.pengadaan.isLoading || this.props.dokumen.isLoading ? true: false} size="sm">
                <ModalBody>
                    <div>
                        <div className={style.cekUpdate}>
                            <Spinner />
                            <div sucUpdate>Waiting....</div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.props.pengadaan.isUpload ? true: false} size="sm">
                <ModalBody>
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Success</div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}?no=${fileName.no_pengadaan}`} />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                {/* <div>{moment(this.state.date).format('LLL')}</div> */}
                                <Button color="success" onClick={this.downloadData}>Download</Button>
                            </div>
                        {level === '2' ? (
                            <div>
                                <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                            </div>
                            ) : (
                                <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            )}
                        </div>
                    </ModalBody>
                    {/* {level === '1' || level === '2' || level === '3' ? (
                    
                    <ModalFooter>
                        <div>{moment(this.state.date).format('LL')}</div>
                        <Button color="danger" onClick={this.openModalReject}>Reject</Button>
                        <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                    </ModalFooter>
                    ) : (
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                    </ModalFooter>)} */}
                </Modal>
                <Modal className='modalBid' isOpen={this.state.openBid} size="xl" toggle={this.openModalBidding} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody className='bodyBid'>
                        {/* <div className={style.readPdf}>
                        </div> */}
                        <iframe 
                        allowfullscreen={true}
                        height="600"
                        className='bidding' 
                        src={fileName.path} 
                        title="Dokumen Bidding"
                        />
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                {/* <Button color="success" onClick={this.downloadData}>Download</Button> */}
                            </div>
                        {level === '2' ? (
                            <div>
                                <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                            </div>
                            ) : (
                                <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove} size="lg" toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}> {fileName.nama_dokumen} </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApproveIo}>
                                <Button color="primary" onClick={this.approveDokumen}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openRejectDis} toggle={this.openModalRejectDis} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectDokumen(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className={style.quest}>Anda yakin untuk reject {this.state.fileName.nama_dokumen} ?</div>
                            <div className={style.alasan}>
                                <text className="col-md-3">
                                    Alasan
                                </text>
                                <Input 
                                type="name" 
                                name="select" 
                                className="col-md-9"
                                value={values.alasan}
                                onChange={handleChange('alasan')}
                                onBlur={handleBlur('alasan')}
                                />
                            </div>
                            {errors.alasan ? (
                                    <text className={style.txtError}>{errors.alasan}</text>
                                ) : null}
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={handleSubmit}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalRejectDis}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isAppall} toggle={this.openAppall} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}> Pengadaan {newIo.map(item => { return (listMut.find(element => element === item.id) !== undefined ? `${item.no_pengadaan},` : null)})} </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={this.approveAll}>Ya</Button>
                                <Button color="secondary" onClick={this.openAppall}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: ".",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectIo(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                                <div className='mb-2 quest'>Anda yakin untuk reject ?</div>
                                <div className='mb-2 titStatus'>Pilih reject :</div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {this.state.typeReject === 'perbaikan' ? true : false}
                                    onClick={this.state.typeReject === 'perbaikan' ? () => this.rejectRej('perbaikan') : () => this.rejectApp('perbaikan')}
                                    />  Perbaikan
                                </div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {this.state.typeReject === 'pembatalan' ? true : false}
                                    onClick={this.state.typeReject === 'pembatalan' ? () => this.rejectRej('pembatalan') : () => this.rejectApp('pembatalan')}
                                    />  Pembatalan
                                </div>
                                <div className='ml-2'>
                                    {this.state.typeReject === '' ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                                <div className='mb-2 mt-2 titStatus'>Pilih Menu Revisi :</div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {this.state.typeReject === 'Revisi Area' ? true : false}
                                    onClick={this.state.typeReject === 'Revisi Area' ? () => this.menuRej('Revisi Area') : () => this.menuApp('Revisi Area')}
                                    />  Revisi Area
                                </div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {this.state.typeReject === 'pembatalan' ? true : false}
                                    onClick={this.state.typeReject === 'pembatalan' ? () => this.menuRej('pembatalan') : () => this.menuApp('pembatalan')}
                                    />  Revisi Asset
                                </div>
                                <div className='ml-2'>
                                    {this.state.typeReject === '' ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                                <div className='mb-2 mt-2 titStatus'>Pilih alasan :</div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {listStat.find(element => element === 'Deskripsi, kuantitas, dan harga tidak sesuai') !== undefined ? true : false}
                                    onClick={listStat.find(element => element === 'Deskripsi, kuantitas, dan harga tidak sesuai') === undefined ? () => this.statusApp('Deskripsi, kuantitas, dan harga tidak sesuai') : () => this.statusRej('Deskripsi, kuantitas, dan harga tidak sesuai')}
                                    />  Deskripsi, kuantitas, dan harga tidak sesuai
                                </div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {listStat.find(element => element === 'Dokumen lampiran tidak sesuai') !== undefined ? true : false}
                                    onClick={listStat.find(element => element === 'Dokumen lampiran tidak sesuai') === undefined ? () => this.statusApp('Dokumen lampiran tidak sesuai') : () => this.statusRej('Dokumen lampiran tidak sesuai')}
                                    />  Dokumen lampiran tidak sesuai
                                </div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {listStat.find(element => element === 'Alasan di form io yang tidak sesuai') !== undefined ? true : false}
                                    onClick={listStat.find(element => element === 'Alasan di form io yang tidak sesuai') === undefined ? () => this.statusApp('Alasan di form io yang tidak sesuai') : () => this.statusRej('Alasan di form io yang tidak sesuai')}
                                    />  Alasan di form io yang tidak sesuai
                                </div>
                                <div className={style.alasan}>
                                    <text className='ml-2'>
                                        Lainnya
                                    </text>
                                </div>
                                <Input 
                                type="name" 
                                name="select" 
                                className="ml-2 inputRec"
                                value={values.alasan}
                                onChange={handleChange('alasan')}
                                onBlur={handleBlur('alasan')}
                                />
                                <div className='ml-2'>
                                    {errors.alasan ? (
                                        <text className={style.txtError}>{errors.alasan}</text>
                                    ) : null}
                                </div>
                                <div className={style.btnApprove}>
                                    <Button color="primary" disabled={(values.alasan === '.' || values.alasan === '' || this.state.typeReject === '' || this.state.menuRev === '') && listStat.length === 0 ? true : false} onClick={handleSubmit}>Submit</Button>
                                    <Button className='ml-2' color="secondary" onClick={this.openModalReject}>Close</Button>
                                </div>
                            </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApproveIo} toggle={this.openModalApproveIo} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}>  </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={this.approveIo}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApproveIo}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formTrack} toggle={() => {this.openModalTrack(); this.showCollap('close')}} size="xl">
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={detailTrack.find(({status_form}) => status_form == 26) === undefined ? false : true}>
                        <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                    </Alert> */}
                    <ModalBody>
                        <Row className='trackTitle ml-4'>
                            <Col>
                                Tracking Pengadaan Asset
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                                Kode Area
                            </Col>
                            <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : detailTrack[0].kode_plant}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                                Area
                            </Col>
                            <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : detailTrack[0].area}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                                No Pengadaan
                            </Col>
                            <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : detailTrack[0].no_pengadaan}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub1'>
                            <Col md={3}>
                            Tanggal Pengajuan
                            </Col>
                            <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : moment(detailTrack[0].createdAt === null ? detailTrack[0].createdAt : detailTrack[0].createdAt).locale('idn').format('DD MMMM YYYY ')}
                            </Col>
                        </Row>
                        <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                            <div class="step completed">
                                <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Submit')} ><FiSend size={40} className="center1" /></button>
                                </div>
                                <h4 class="step-title">Submit</h4>
                            </div>
                            <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 1 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Verifikasi Aset')}><FiSettings size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Verifikasi Aset</h4>
                            </div>
                            <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 2 ? "step completed" : 'step'} >
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Pengajuan')}><MdAssignment size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Approval Form IO</h4>
                            </div>
                            <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 3 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Proses Budget')}><FiSettings size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Proses Budget</h4>
                            </div>
                            <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Eksekusi')}><FiTruck size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Eksekusi Pengadaan Aset</h4>
                            </div>
                            <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Selesai</h4>
                            </div>
                        </div>
                        <Collapse isOpen={this.state.collap} className="collapBody">
                            <Card className="cardCollap">
                                <CardBody>
                                    <div className='textCard1'>{this.state.tipeCol} Pengadaan Asset</div>
                                    {this.state.tipeCol === 'submit' ? (
                                        <div>Tanggal submit : {detailTrack[0] === undefined ? '' : moment(detailTrack[0].createdAt === null ? detailTrack[0].createdAt : detailTrack[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div>Rincian Item:</div>
                                    <Table striped bordered responsive hover className="tableDis mb-3">
                                        <thead>
                                            <tr>
                                                <th>Qty</th>
                                                <th>Description</th>
                                                <th>Price/unit</th>
                                                <th>Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailTrack.length !== 0 && detailTrack.map(item => {
                                                return (
                                                    <tr>
                                                        <td>{item.qty}</td>
                                                        <td>{item.nama}</td>
                                                        <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {detailTrack[0] === undefined || this.state.tipeCol === 'Submit' ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                            {this.state.tipeCol === 'Pengajuan' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    {detailTrack[0] !== undefined && detailTrack[0].appForm.length && detailTrack[0].appForm.slice(0).reverse().map(item => {
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
                                                    <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 9 || detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Filling No Asset</h4>
                                                    </div>
                                                    <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            ) :  this.state.tipeCol === 'Verifikasi Aset' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 9 || detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Verifikasi Aset atau Non Asset</h4>
                                                    </div>
                                                    <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            ) : this.state.tipeCol === 'Proses Budget' && (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 3 || detailTrack[0].status_form > 3 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Filling No Io</h4>
                                                    </div>
                                                    <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 3 ? "step completed" : 'step'}>
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
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailTrack[0] !== undefined && detailTrack[0].no_pengadaan})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => {this.openModalTrack(); this.showCollap('close')}}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                <ModalBody>
                    {this.state.confirm === 'submit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'submitnot' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            <div className="errApprove mt-2">Transaksi dibatalkan</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'isupdate' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update Nomor IO</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'approve' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'upreason' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update Alasan</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'reject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejApprove' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejReject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            <div className="errApprove mt-2">Mohon isi Nomor IO terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            <div className="errApprove mt-2">Mohon identifikasi asset terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseSubmitDok' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            <div className="errApprove mt-2">Mohon approve dokumen terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseAppDok' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                            <div className="errApprove mt-2">Mohon approve dokumen terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'recent' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Permintaan gagal</div>
                            <div className="errApprove mt-2">Mohon isi alasan terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'apitrue' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Connection Success</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'apifalse' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Connection Failed</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'appDocTrue' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve Dokumen</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejDocTrue' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject Dokumen</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'appDocFalse' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve Dokumen</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejDocFalse' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Reject Dokumen</div>
                        </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </ModalBody>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    asset: state.asset,
    disposal: state.disposal,
    approve: state.approve,
    pengadaan: state.pengadaan,
    setuju: state.setuju,
    notif: state.notif,
    auth: state.auth,
    dokumen: state.dokumen
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNotif: notif.getNotif,
    resetAuth: auth.resetError,
    getPengadaan: pengadaan.getPengadaan,
    getApproveIo: pengadaan.getApproveIo,
    getDocumentIo: pengadaan.getDocumentIo,
    getDokumen: dokumen.getDokumen,
    uploadDocument: pengadaan.uploadDocument,
    approveDocument: pengadaan.approveDocument,
    rejectDocument: pengadaan.rejectDocument,
    resetError: pengadaan.resetError,
    showDokumen: pengadaan.showDokumen,
    getDetail: pengadaan.getDetail,
    updateDataIo: pengadaan.updateDataIo,
    submitIsAsset: pengadaan.submitIsAsset,
    updateNoIo: pengadaan.updateNoIo,
    submitBudget: pengadaan.submitBudget,
    approveIo: pengadaan.approveIo,
    rejectIo: pengadaan.rejectIo,
    resetApp: pengadaan.resetApp,
    getDocCart: pengadaan.getDocCart,
    approveAll: pengadaan.approveAll,
    updateRecent: pengadaan.updateRecent,
    testApiPods: pengadaan.testApiPods,
    submitNotAsset: pengadaan.submitNotAsset,
    podsSend: pengadaan.podsSend
}

export default connect(mapStateToProps, mapDispatchToProps)(Pengadaan)