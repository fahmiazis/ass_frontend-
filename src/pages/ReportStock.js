/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import style from '../assets/css/input.module.css'
import { NavbarBrand, Input, Table, ButtonDropdown,
 DropdownMenu, DropdownToggle, DropdownItem, Button} from 'reactstrap'
import MaterialTitlePanel from "../components/material_title_panel"
import Sidebar from "../components/Header";
import SidebarContent from "../components/sidebar_content"
import stock from '../redux/actions/stock'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'

class ReportStock extends Component {
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
            tipe: 'report',
            group: '',
            fisik: '',
            sap: '',
            kondisi: '',
            limit: 10,
            dropOpen: false,
            nilai_buku: 0,
            accum_dep: 0,
            nilai_acquis: 0,
            drop: false,
            dropBtn: false,
            dropCond: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    componentDidMount () {
        this.getDataStock({limit: 10, search: '', group: '', sap: 'ada', fisik: 'ada', kondisi: 'baik'})
    }

    dropBut = () => {
        this.setState({dropBtn: !this.state.dropBtn})
    }

    dropKondisi = () => {
        this.setState({dropCond: !this.state.dropCond})
    }

    dropOpen = () => {
        this.setState({drop: !this.state.drop})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }

    getDataStock = async (value) => {
        const token = localStorage.getItem("token")
        const { pageRep } = this.props.stock
        const search = value === undefined ? '' : value.search
        const limit = value === undefined ? this.state.limit : value.limit
        const group = value === undefined ? this.state.group : value.group
        await this.props.getReportAll(token, search, limit, pageRep === undefined ? 1 : pageRep.currentPage, group, value.fisik, value.sap, value.kondisi)
        await this.props.getStatusAll(token)
        const {dataRep} = this.props.stock
        this.setState({group: value.group, sap: value.sap, fisik: value.fisik, kondisi: value.kondisi})
        let buku = 0
        let acquis = 0
        let accum = 0
        for (let i = 0; i < dataRep.length; i++) {
            if (dataRep[i].dataAsset !== null) {
                buku += parseInt(dataRep[i].dataAsset.nilai_buku)
                acquis += parseInt(dataRep[i].dataAsset.nilai_acquis)
                accum += parseInt(dataRep[i].dataAsset.accum_dep)
            }
        }
        this.setState({limit: value === undefined ? 10 : value.limit, nilai_buku: buku, nilai_acquis: acquis, accum_dep: accum})
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const { dataRep, pageRep, dataAll } = this.props.stock

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
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Report Stock Opname</div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className='mt-4'>
                                        <div className={style.secHeadDashboard}>
                                            <div>
                                                <text>Status Fisik: </text>
                                                <ButtonDropdown className={style.drop} isOpen={this.state.drop} toggle={this.dropOpen}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.fisik === '' ? 'Pilih status fisik' : this.state.fisik}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {/* <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: ''})}>All</DropdownItem> */}
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'ada', kondisi: this.state.kondisi})}>Ada</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'tidak ada', kondisi: this.state.kondisi})}>Tidak Ada</DropdownItem>
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                            </div>
                                            <div className='ml-3' >
                                                <text>Kondisi: </text>
                                                <ButtonDropdown className={style.drop} isOpen={this.state.dropCond} toggle={this.dropKondisi}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.kondisi === '' ? 'Pilih status fisik' : this.state.kondisi}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {/* <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: ''})}>All</DropdownItem> */}
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: ''})}>-</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'baik'})}>Baik</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'rusak'})}>Rusak</DropdownItem>
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                            </div>
                                            <div className='ml-3' >
                                                <text>Status SAP: </text>
                                                <ButtonDropdown className={style.drop} isOpen={this.state.dropBtn} toggle={this.dropBut}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.sap === '' ? 'Pilih status sap' : this.state.sap === 'null' ? 'Tidak ada' : this.state.sap}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {/* <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'null'})}>All</DropdownItem> */}
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'ada', fisik: this.state.fisik, kondisi: this.state.kondisi})}>Ada</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'null', fisik: this.state.fisik, kondisi: this.state.kondisi})}>Tidak Ada</DropdownItem>
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                            </div>
                                            <div className='ml-3'>
                                                <text>Status Aset: </text>
                                                <ButtonDropdown className={style.drop} isOpen={this.state.dropOpen} toggle={this.dropDown}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.group === '' ? 'Pilih status aset' :  this.state.group}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: '', sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi})}>All</DropdownItem>
                                                    {dataAll.length !== 0 && dataAll.map(item => {
                                                        return (
                                                            <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: item.status, sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi})}>{item.status}</DropdownItem>
                                                        )
                                                    })}
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className={style.searchEmail}>
                                        <text>Search: </text>
                                        <Input 
                                        className={style.search}
                                        onChange={this.onSearch}
                                        value={this.state.search}
                                        onKeyPress={this.onSearch}
                                        >
                                            <FaSearch size={20} />
                                        </Input>
                                    </div> */}
                                </div>
                                <div className={style.tableDashboard}>
                                    {this.state.tipe === 'report' ? (
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>ASSET</th>
                                                    <th>DESKRIPSI</th>
                                                    <th>MERK</th>
                                                    <th>PLANT</th>
                                                    <th>COST CENTER</th>
                                                    <th>AREA</th>
                                                    <th>SATUAN</th>
                                                    <th>UNIT</th>
                                                    <th>KONDISI</th>
                                                    <th>LOKASI</th>
                                                    <th>STATUS ASET</th>
                                                    <th>ACQUIS VAL</th>
                                                    <th>ACCUM DEP</th>
                                                    <th>BOOK VAL</th>
                                                    <th>KETERANGAN</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataRep.length !== 0 && dataRep.map(item => {
                                                    return (
                                                    <tr>
                                                        <th scope="row">{(dataRep.indexOf(item) + (((pageRep.currentPage - 1) * pageRep.limitPerPage) + 1))}</th>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.deskripsi}</td>
                                                        <td>{item.merk}</td>
                                                        <td>{item.kode_plant}</td>
                                                        <td>{item.depo.cost_center}</td>
                                                        <td>{item.depo.nama_area}</td>
                                                        <td>{item.satuan}</td>
                                                        <td>{item.unit}</td>
                                                        <td>{item.kondisi}</td>
                                                        <td>{item.lokasi}</td>
                                                        <td>{item.grouping}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_acquis}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.accum_dep}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_buku}</td>
                                                        <td>{item.keterangan}</td>
                                                    </tr>
                                                    )})}
                                                    <tr>
                                                        <td colSpan={12} className="sumNilai">Jumlah</td>
                                                        <td>{this.state.nilai_acquis}</td>
                                                        <td>{this.state.accum_dep}</td>
                                                        <td>{this.state.nilai_buku}</td>
                                                        <td></td>
                                                    </tr>
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Rekapitulasi</th>
                                                    <th>Acquis.val.</th>
                                                    <th>Accum.dep.</th>
                                                    <th>Book val.</th>
                                                    <th>Eksekusi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr>
                                                        <th scope="row">1</th>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className={style.infoPageEmail}>
                                    <Button color="success">Download</Button>
                                    <div className={style.pageButton}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
            </>
        )
    }
}

const mapStateToProps = state => ({
    stock: state.stock
})

const mapDispatchToProps = {
    logout: auth.logout,
    getReportAll: stock.getReportAll,
    getStatusAll: stock.getStatusAll
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportStock)
