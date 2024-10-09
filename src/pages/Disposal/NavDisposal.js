/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../../components/Sidebar'
import {VscAccount} from 'react-icons/vsc'
import {FiLogOut, FiSend, FiTruck, FiEye} from 'react-icons/fi'
import {BiRevision} from 'react-icons/bi'
import {MdAssignment, MdVerifiedUser, MdMonetizationOn, MdOutlineTrackChanges} from 'react-icons/md'
import {HiOutlineDocumentReport} from 'react-icons/hi'
import {RiDraftFill} from 'react-icons/ri'
import {FaFileSignature} from 'react-icons/fa'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'
import { Row } from 'reactstrap'
import '../../assets/css/style.css'
import Bell from '../../components/Bell'
import Account from '../../components/Account'
import auth from '../../redux/actions/auth'
import user from '../../redux/actions/user'
import notif from '../../redux/actions/notif'
import {connect} from 'react-redux'
import styleHome from '../../assets/css/Home.module.css'

class NavDisposal extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isOpen: false,
          searchQuery: '',
          filterStatus: 'Semua Status',
          sidebarOpen: true, // Untuk expand/collapse di mode web
          mobileSidebarVisible: false, // Untuk hidden/show di mode mobile
          isMobile: window.innerWidth <= 768, // Mendeteksi apakah di mode mobile
        };
      }

    goPengadaan = () => {
        this.props.history.push('/pengadaan')
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    componentDidMount() {
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const level = localStorage.getItem('level')
        window.addEventListener("resize", this.handleResize);
        this.getNotif()
        if (email === 'null' || email === '' || fullname === 'null' || fullname === '') {
            if (id !== null && level !== '5') {
                this.openModalEdit()
            } else if (level === '5') {
                console.log('5')
            } else {
                this.relogin()
            }
        } else if (id === null) {
            this.relogin()
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize)
    }

    handleResize = () => {
        this.setState({ isMobile: window.innerWidth <= 768 })
    };

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data
        const {isMobile} = this.state

        return (
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar isMobile={this.state.isMobile} />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <Bell dataNotif={dataNotif} color={"black"}/>
                            <Account color={"black"}/>
                        </div>
                    </div>
                    <div className={styleHome.mainContent}>
                        <main className={styleHome.mainSection}>
                        <h1 className={styleHome.title}>Menu Disposal Aset</h1>
                        <h4 className={styleHome.subtitle}>Please select an option</h4>

                        <div className={`${styleHome.assetContainer} row`}>

                            {level === '6' ? (
                                <>
                                    <div onClick={() => this.goRoute('purchdis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <MdMonetizationOn size={220} className='mt-4' />
                                            <p className='mt-4'>Purchasing disposal</p>
                                        </div>
                                    </div>
                                    <div onClick={() => this.goRoute('editpurch')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <BiRevision size={220} className='mt-4' />
                                            <p className='mt-4'>Revisi Purchasing disposal</p>
                                        </div>
                                    </div>
                                </>
                        ) : level === '5' || level === '9'  ? (
                            <>
                                <div onClick={() => this.goRoute('disposal')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <FiSend size={220} className='mt-4' />
                                        <p className='mt-4'>Pengajuan disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('eksdis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <FiTruck size={220} className='mt-4' />
                                        <p className='mt-4'>Eksekusi disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('eksdis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <BiRevision size={220} className='mt-4' />
                                        <p className='mt-4'>Revisi Disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('trackdis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <MdOutlineTrackChanges size={220} className='mt-4' />
                                        <p className='mt-4'>Tracking Disposal</p>
                                    </div>
                                </div>
                            </>
                        ) : level === '4' || level === '3' ? (
                            <>
                                <div onClick={() => this.goRoute('disposal')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <MdVerifiedUser size={220} className='mt-4' />
                                        <p className='mt-4'>Tax & Finance disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('disposal')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <BiRevision size={220} className='mt-4' />
                                        <p className='mt-4'>Edit Tax & Finance disposal</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div onClick={() => this.goRoute('disposal')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <FiSend size={220} className='mt-4' />
                                        <p className='mt-4'>Pengajuan disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('setdis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <FaFileSignature size={220} className='mt-4' />
                                        <p className='mt-4'>Persetujuan disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('eksdis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <FiTruck size={220} className='mt-4' />
                                        <p className='mt-4'>Eksekusi disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('taxfin')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <MdVerifiedUser size={220} className='mt-4' />
                                        <p className='mt-4'>Tax & Finance disposal</p>
                                    </div>
                                </div>
                                <div onClick={() => this.goRoute('trackdis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.navCard}>
                                        <MdOutlineTrackChanges size={220} className='mt-4' />
                                        <p className='mt-4'>Tracking Disposal</p>
                                    </div>
                                </div>
                                {level === '2' ? (
                                    <>
                                        <div onClick={() => this.goRoute('report')} className="col-12 col-md-6 col-lg-3 mb-4">
                                            <div className={styleHome.navCard}>
                                                <HiOutlineDocumentReport size={220} className='mt-4' />
                                                <p className='mt-4'>Report disposal</p>
                                            </div>
                                        </div>
                                        <div onClick={() => this.goRoute('mondis')} className="col-12 col-md-6 col-lg-3 mb-4">
                                            <div className={styleHome.navCard}>
                                                <FiEye size={220} className='mt-4' />
                                                <p className='mt-4'>Monitoring disposal</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div></div>
                                )}
                            </>
                        )}
                        </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    notif: state.notif
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    changePassword: user.changePassword,
    getNotif: notif.getNotif,
    upNotif: notif.upNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(NavDisposal)
