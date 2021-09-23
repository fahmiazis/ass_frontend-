/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { NavbarBrand, Row, Col, Table, Button, Modal, ModalBody, ModalFooter, Container, Alert, Spinner, ModalHeader } from 'reactstrap'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import style from '../assets/css/input.module.css'
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai'
import { BsCircle } from 'react-icons/bs'
import { FaBars, FaUserCircle } from 'react-icons/fa'
import Sidebar from "../components/Header"
import MaterialTitlePanel from "../components/material_title_panel"
import {connect} from 'react-redux'
import moment from 'moment'
import disposal from '../redux/actions/disposal'
import pengadaan from '../redux/actions/pengadaan'
import setuju from '../redux/actions/setuju'
import {default as axios} from 'axios'
import auth from '../redux/actions/auth'
import SidebarContent from "../components/sidebar_content"
import Pdf from "../components/Pdf"
const {REACT_APP_BACKEND_URL} = process.env

class PersetujuanDis extends Component {

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
            search: '',
            limit: 100,
            idStatus: 0,
            openModalDoc: false,
            dataRinci: {},
            detailDis: [],
            preview: false,
            date: '',
            idDoc: null,
            fileName: {},
            openPdf: false,
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.disposal
        const token = localStorage.getItem('token')
        const detail = []
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].no_disposal === value) {
                detail.push(dataDis[i])
            }
        }
        await this.props.getApproveDisposal(token, value, 'disposal pengajuan')
        this.setState({detailDis: detail})
        this.openPreview()
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

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openPreview = () => {
        this.setState({preview: !this.state.preview})
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    openProsesModalDoc = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    componentDidMount () {
        const {dataDis} = this.props.setuju
        this.setState({idStatus: dataDis[0].status_app})
        this.getApproveSet(dataDis[0].status_app)
    }

    getDataDisposal = async (value) => {
        const token = localStorage.getItem("token")
        const {dataDis} = this.props.setuju
        await this.props.getSetDisposal(token, 100, "", 1, dataDis[0].status_app, 'persetujuan')
    }

    getApproveSet = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getApproveSetDisposal(token, val, 'disposal persetujuan')
    }

    approveSet = async () => {
        const {dataDis} = this.props.setuju
        const token = localStorage.getItem("token")
        await this.props.approveSetDisposal(token, dataDis[0].status_app)
        this.getApproveSet(dataDis[0].status_app)
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataDis, disApp} = this.props.setuju
        const { dataDoc } = this.props.disposal
        const appPeng = this.props.disposal.disApp
        const { detailDis } = this.state
        
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
          }
        return (
            <>
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className="bodyPer">
                            <div>PT. Pinus Merah Abadi</div>
                            <div className="modalDis">
                                <text className="titleModDis">Persetujuan Disposal Asset</text>
                            </div>
                            <div className="mb-2"><text className="txtTrans">Bandung</text>, {moment().format('DD MMMM YYYY ')}</div>
                            <Row>
                                <Col md={2} className="mb-3">
                                Hal : Persetujuan Disposal Asset
                                </Col>
                            </Row>
                            <div>Kepada Yth.</div>
                            <div className="mb-3">Bpk. Erwin Lesmana</div>
                            <div className="mb-3">Dengan Hormat,</div>
                            <div>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</div>
                            <div className="mb-3">Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</div>
                            <Table striped bordered responsive hover className="tableDis mb-3">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nomor Aset / Inventaris</th>
                                        <th>Area (Cabang/Depo/CP)</th>
                                        <th>Nama Barang</th>
                                        <th>Nilai Buku</th>
                                        <th>Nilai Jual</th>
                                        <th>Tanggal Perolehan</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataDis.length !== 0 ? dataDis.map(item => {
                                        return (
                                            // <tr onClick={() => this.openProsesModalDoc(item)}></tr>
                                            <tr onClick={() => this.getDetailDisposal(item.no_disposal)}>
                                                <th scope="row">{dataDis.indexOf(item) + 1}</th>
                                                <td>{item.no_asset}</td>
                                                <td>{item.area}</td>
                                                <td>{item.nama_asset}</td>
                                                <td>{item.nilai_buku}</td>
                                                <td>{item.nilai_jual}</td>
                                                <td>{item.createdAt}</td>
                                                <td>{item.keterangan}</td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <th scope="row">1</th>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <div className="mb-3">Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</div>
                            <Table borderless className="tabPreview">
                                <thead>
                                    <tr>
                                        <th className="buatPre">Diajukan oleh,</th>
                                        <th className="buatPre">Disetujui oleh,</th>
                                    </tr>
                                </thead>
                                <tbody className="tbodyPre">
                                    <tr>
                                        <td className="restTable">
                                            <Table bordered className="divPre">
                                                <thead>
                                                    <tr>
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                            return (
                                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </td>
                                        <td className="restTable">
                                            <Table bordered className="divPre">
                                                <thead>
                                                    <tr>
                                                        {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
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
                            <div className="btnFoot1">
                                <div className="btnfootapp">
                                    <Button className="mr-2" color="danger" disabled>
                                        Reject
                                    </Button>
                                    {level === '23' || level === '22' || level === '25' ? (
                                        <Button color="success">
                                            <label>
                                                <input type="file" className="file-upload2" onChange={this.approveSet}/>
                                                Approve
                                            </label>
                                        </Button>
                                    ) : (
                                        <Button color="success" onClick={this.approveSet}>
                                            Approve
                                        </Button>
                                    )}
                                </div>
                                <Button color="primary" className="btnDownloadForm">
                                <PDFDownloadLink className="btnDownloadForm" document={
                                    <Document>
                                        <Page size="A4" style={styles.page} orientation="landscape">
                                            <Text style={styles.font}>PT. Pinus Merah Abadi</Text>
                                            <View style={styles.modalDis}>
                                                <Text style={[styles.titleModDis, styles.fontTit]}>Persetujuan Disposal Asset</Text>
                                            </View>
                                            <View style={styles.marbot}><Text style={styles.font}>Bandung, {moment().format('DD MMMM YYYY ')}</Text></View>
                                            <View style={styles.marbotT}>
                                                <Text style={[styles.font]}>
                                                Hal : Persetujuan Disposal Asset
                                                </Text>
                                            </View>
                                            <Text style={styles.font}>Kepada Yth.</Text>
                                            <Text style={[styles.marbotT, styles.font]}>Bpk. Erwin Lesmana</Text>
                                            <Text style={[styles.marbotT, styles.font]}>Dengan Hormat,</Text>
                                            <Text style={styles.font}>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</Text>
                                            <Text style={[styles.marbotT, styles.font]}>Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</Text>
                                            <View style={styles.table}>
                                                <View style={[styles.row, styles.header]}>
                                                    <Text style={[styles.cell1, style.headerText]}>No</Text>
                                                    <Text style={[styles.cell1, style.headerText]}>Nomor Aset / Inventaris</Text>
                                                    <Text style={[styles.cell1, style.headerText]}>Area (Cabang/Depo/CP)</Text>
                                                    <Text style={[styles.cell1, style.headerText]}>Nama Barang</Text>
                                                    <Text style={[styles.cell1, style.headerText]}>Nilai Buku</Text>
                                                    <Text style={[styles.cell1, style.headerText]}>Nilai Jual</Text>
                                                    <Text style={[styles.cell1, style.headerText]}>Tanggal Perolehan</Text>
                                                    <Text style={[styles.cell1, style.headerText]}>Keterangan</Text>
                                                </View>
                                                {dataDis.length !== 0 && dataDis.map(item => {
                                                return(
                                                    <View style={[styles.row]}>
                                                        <Text style={[styles.cell, styles.body]}>{dataDis.indexOf(item) + 1}</Text>
                                                        <Text style={[styles.cell, styles.body]}>{item.no_asset}</Text>
                                                        <Text style={[styles.cell, styles.body]}>{item.area}</Text>
                                                        <Text style={[styles.cell, styles.body]}>{item.nama_asset}</Text>
                                                        <Text style={[styles.cell, styles.body]}>{item.nilai_buku}</Text>
                                                        <Text style={[styles.cell, styles.body]}>{item.nilai_jual}</Text>
                                                        <Text style={[styles.cell, styles.body]}>{item.createdAt}</Text>
                                                        <Text style={[styles.cell, styles.body]}>{item.keterangan}</Text>
                                                    </View>
                                                    )
                                                })}
                                            </View>
                                            <Text style={[styles.marbotT, styles.font]}>Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</Text>
                                            <View style={styles.footTtd}>
                                                <View style={styles.tableTtd}>
                                                    <View style={[styles.row, styles.headerTtd]}>
                                                        <Text style={[styles.cellrow, style.headerTxt]}>Diajukan oleh,</Text>
                                                    </View>
                                                    <View style={[styles.row, styles.headerTtd]}>
                                                        <View style={[styles.cell2]}>
                                                            <View style={styles.table}>
                                                                <View style={[styles.row]}>
                                                                    {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                                        return (
                                                                            <Text style={[styles.cellTtdHead]}>{item.nama === null ? "-" : item.nama}</Text>
                                                                        )
                                                                    })}
                                                                </View>
                                                                <View style={[styles.row]}>
                                                                    {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                                        return (
                                                                            <Text style={[styles.cellTtdBody]}>{item.jabatan === null ? "-" : item.jabatan}</Text>
                                                                        )
                                                                    })}
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.table}>
                                                    <View style={[styles.row, styles.headerTtd]}>
                                                        <Text style={[styles.cellrow, style.headerTxt]}>Disetujui oleh,</Text>
                                                    </View>
                                                    <View style={[styles.row, styles.headerTtd]}>
                                                        <View style={[styles.cell2]}>
                                                            <View style={styles.table}>
                                                                <View style={[styles.row]}>
                                                                {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                                    return (
                                                                        <Text style={[styles.cellTtdHead]}>{item.nama === null ? "-" : item.nama}</Text>     
                                                                    )
                                                                })}
                                                                </View>
                                                                <View style={[styles.row]}>
                                                                    {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                                        return (
                                                                            <Text style={[styles.cellTtdBody]}>{item.jabatan === null ? "-" : item.jabatan}</Text>
                                                                        )
                                                                    })}
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Page>
                                    </Document>
                                    } 
                                    fileName={`Form persetujuan D${dataDis[0].status_app}.pdf`}>
                                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Form')}
                                </PDFDownloadLink>
                                </Button>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
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
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            -
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
            <Modal isOpen={this.props.setuju.isLoading ? true: false} size="sm">
                <ModalBody>
                <div>
                    <div className={style.cekUpdate}>
                        <Spinner />
                        <div sucUpdate>Waiting....</div>
                    </div>
                </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.preview} toggle={this.openPreview} size="xl">
                    <ModalBody>
                        <div>PT. Pinus Merah Abadi</div>
                        <div className="modalDis">
                            <text className="titleModDis">Form Pengajuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2}>
                            Hal
                            </Col>
                            <Col md={10}>
                            : Pengajuan Disposal Asset
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={2}>
                            {detailDis[0] === undefined ? "" :
                            detailDis[0].status_depo === "Cabang Scylla" || detailDis.status_depo === "Cabang SAP" ? "Cabang" : "Depo"}
                            </Col>
                            <Col md={10} className="txtTrans">
                            : {detailDis[0] !== undefined && detailDis[0].area}
                            </Col>
                        </Row>
                        <div>Kepada Yth.</div>
                        <div>Bpk/Ibu Pimpinan</div>
                        <div className="mb-2">Di tempat</div>
                        <div>Dengan Hormat,</div>
                        <div className="mb-3">Dengan surat ini kami mengajukan permohonan disposal aset dengan perincian sbb :</div>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor Asset</th>
                                    <th>Nama Barang</th>
                                    <th>Merk/Type</th>
                                    <th>Kategori</th>
                                    <th>Status Depo</th>
                                    <th>Cost Center</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 && detailDis.map(item => {
                                    return (
                                        <tr  onClick={() => this.openProsesModalDoc(item)}>
                                            <th scope="row">{detailDis.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.status_depo}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.nilai_buku}</td>
                                            <td>{item.nilai_jual}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
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
                                                    {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
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
                                                    {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
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
                                                    {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
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
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={this.openPreview}>
                                Print
                            </Button>
                            <Button color="success" onClick={this.openPreview}>
                                Close
                            </Button>
                        </div>
                    </div>
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
                        {level === '5' ? (
                            <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            ) : (
                                <div>
                                    {/* <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button> */}
                                </div>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const styles = StyleSheet.create({
    page: {
      backgroundColor: '#FFFFFF',
      paddingTop: '20px',
      paddingLeft: '10px',
      paddingRight: '10px'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    modalDis: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleModDis: {
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
    marbot: {
        marginBottom: '10px',
    },
    font: {
        fontSize: '11px'
    },
    fontTit: {
        fontSize: '14px'
    },
    marbotT: {
        marginBottom: '15px',
    },
    table: {
        fontSize: 10,
        width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch"
      },
      tableTtd: {
        fontSize: 10,
        width: '20%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch"
      },
      footTtd: {
        display: 'flex',
        flexDirection: 'row'
      },
      row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 35,
        marginBottom: 0
      },
      row1: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch",
        flexGrow: 0,
        width: 200,
        flexShrink: 0,
        flexBasis: 35,
        marginBottom: 0
      },
      cell: {
        borderColor: "gray",
        borderStyle: "solid",
        borderWidth: 0.5,
        borderTopWidth: 1,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "stretch",
        padding: 8,
        paddingBottom: 10
      },
      cell1: {
        borderColor: "black",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "stretch",
        padding: 14,
        marginBottom: 2
      },
      cellrow: {
        borderColor: "black",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "center",
        textAlign: 'center',
        padding: 14,
        marginBottom: 2
      },
      cell2: {
        borderColor: "black",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "stretch",
        padding: 0,
        marginBottom: 2
      },
      cellTtdHead: {
        borderColor: "black",
        borderStyle: "solid",
        borderBottomWidth: 0,
        borderLeftWidth: 1,
        borderRightWidth: 0,
        borderTopWidth: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "center",
        padding: 14,
        textAlign: 'center'
      },
      cellTtdBody: {
        borderColor: "black",
        borderStyle: "solid",
        borderBottomWidth: 0,
        borderLeftWidth: 1,
        borderRightWidth: 0,
        borderTopWidth: 1,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "center",
        padding: 8,
        textAlign: 'center'
      },
      header: {
        backgroundColor: "gray"
      },
      headerTtd: {
          backgroundColor: "#FFFFFF"
      },
      body: {
        backgroundColor: "#eee"
      },
      headerText: {
        fontSize: 11,
        fontWeight: "bold",
        color: "black",
      },
      headerTxt: {
        fontSize: 11,
        fontWeight: "bold",
        color: "black",
        textAlign: 'center'
      },
      tableText: {
        margin: 10,
        fontSize: 10,
        color: 'neutralDark'
      }
  });

const mapStateToProps = state => ({
    asset: state.asset,
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    setuju: state.setuju
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getDisposal,
    addDisposal: disposal.addDisposal,
    deleteDisposal: disposal.deleteDisposal,
    resetErrorDis: disposal.reset,
    showDokumen: pengadaan.showDokumen,
    resetDis: disposal.reset,
    getSetDisposal: setuju.getSetDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    approveSetDisposal: setuju.approveSetDisposal,
    getDocumentDis: disposal.getDocumentDis,
    getApproveDisposal: disposal.getApproveDisposal,
}

export default connect(mapStateToProps, mapDispatchToProps)(PersetujuanDis)
