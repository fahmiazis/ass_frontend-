/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getDisposal: (token, limit, search, page, status, tipe) => ({
        type: 'GET_DISPOSAL',
        payload: http(token).get(`/disposal/get?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getDetailDisposal: (token, nomor) => ({
        type: 'DETAIL_DISPOSAL',
        payload: http(token).get(`/disposal/detail/${nomor}`)
    }),
    addDisposal: (token, id) => ({
        type: 'ADD_DISPOSAL',
        payload: http(token).post(`/disposal/add/${id}`)
    }),
    addSell: (token, id) => ({
        type: 'ADD_DISPOSAL',
        payload: http(token).post(`/disposal/sell/${id}`)
    }),
    deleteDisposal: (token, asset) => ({
        type: 'DELETE_DISPOSAL',
        payload: http(token).delete(`/disposal/delete/${asset}`)
    }),
    updateDisposal: (token, id, data, tipe) => ({
        type: 'UPDATE_DISPOSAL',
        payload: http(token).patch(`/disposal/update/${id}/${tipe === undefined ? 'king' : tipe}`, qs.stringify(data))
    }),
    submitDisposal: (token) => ({
        type: 'SUBMIT_DISPOSAL',
        payload: http(token).post(`/disposal/submit`)
    }),
    getApproveDisposal: (token, no, nama) => ({
        type: 'GET_APPDIS',
        payload: http(token).get(`/disposal/approve/${no}/${nama}`)
    }),
    approveDisposal: (token, no) => ({
        type: 'APPROVE_DIS',
        payload: http(token).patch(`/disposal/app/${no}`)
    }),
    rejectDisposal: (token, no, data) => ({
        type: 'REJECT_DIS',
        payload: http(token).patch(`/disposal/rej/${no}`, qs.stringify(data))
    }),
    getDocumentDis: (token, no, tipeDokumen, tipe) => ({
        type: 'GET_DOCDIS',
        payload: http(token).get(`/disposal/doc/${no}?tipeDokumen=${tipeDokumen}&tipe=${tipe}`)
    }),
    uploadDocumentDis: (token, id, data) => ({
        type: 'UPLOAD_DOCDIS',
        payload: http(token).post(`/disposal/upload/${id}`, data)
    }),
    approveDocDis: (token, id) => ({
        type: 'APPROVE_DOCDIS',
        payload: http(token).patch(`/disposal/docapp/${id}`)
    }),
    rejectDocDis: (token, id, data) => ({
        type:'REJECT_DOCDIS',
        payload: http(token).patch(`/disposal/docrej/${id}`, qs.stringify(data))
    }),
    getKeterangan: (token) => ({
        type: 'GET_KET',
        payload: http(token).get(`/ket/get`)
    }),
    reset: () => ({
        type: 'RESET_DISPOSAL'
    })
}