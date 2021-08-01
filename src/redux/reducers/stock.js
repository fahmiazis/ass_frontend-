/* eslint-disable import/no-anonymous-default-export */
const stockState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isSubmit: false,
    isGet: false,
    isApprove: false,
    isReject: false,
    isGetApp: false,
    getStock: false,
    stockDetail: false,
    isDetail: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataAsset: [],
    dataStock: [],
    detailStock: [],
    alertM: '',
    pict: [],
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    stockApp: {},
};

export default (state=stockState, action) => {
    switch(action.type){
        case 'GET_STOCK_PENDING': {
            return {
                ...state,
                getStock: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                getStock: true,
                dataStock: action.payload.data.result.rows,
                alertMsg: 'get stock Succesfully',
                page: action.payload.data.pageInfo
            };
        }
        case 'GET_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                getStock: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DETAIL_STOCK_PENDING': {
            return {
                ...state,
                stockDetail: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DETAIL_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                stockDetail: true,
                detailStock: action.payload.data.result,
                pict: action.payload.data.pict,
                alertMsg: 'get stock Succesfully',
            };
        }
        case 'DETAIL_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                stockDetail: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'SUBMIT_STOCK_PENDING': {
            return {
                ...state,
                isSubmit: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'SUBMIT_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isSubmit: true,
            };
        }
        case 'SUBMIT_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isSubmit: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'APPROVE_STOCK_PENDING': {
            return {
                ...state,
                isApprove: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'APPROVE_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isApprove: true,
            };
        }
        case 'APPROVE_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isApprove: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'REJECT_STOCK_PENDING': {
            return {
                ...state,
                isReject: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'REJECT_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isReject: true,
            };
        }
        case 'REJECT_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isReject: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'GET_APPSTOCK_PENDING': {
            return {
                ...state,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'GET_APPSTOCK_FULFILLED': {
            return {
                ...state,
                isGetApp: true,
                stockApp: action.payload.data.result,
                isLoading: false,
                alertMsg: 'get approve disposal Succesfully',
            };
        }
        case 'GET_APPSTOCK_REJECTED': {
            return {
                ...state,
                isError: true,
                isLoading: false,
                alertMsg: "Unable connect to server"
            };
        }
        case 'DELETE_STOCK_PENDING': {
            return {
                ...state,
                isDelete: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'DELETE_STOCK_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isDelete: true,
                alertMsg: 'delete stock Succesfully',
            };
        }
        case 'DELETE_STOCK_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isDelete: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'UPLOAD_PICTURE_PENDING': {
            return {
                ...state,
                isUpload: false,
                isLoading: true,
                alertMsg: 'Waiting ...'
            };
        }
        case 'UPLOAD_PICTURE_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isError: false,
                isUpload: true,
                alertMsg: 'upload image stock Succesfully',
            };
        }
        case 'UPLOAD_PICTURE_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isUpload: false,
                isError: true,
                alertMsg: "Unable connect to server"
            };
        }
        case 'RESET_STOCK': {
            return {
                ...state,
                isError: false,
                isDelete: false,
                isUpload: false,
                isGet: false,
                isExport: false
            }
        }
        default: {
            return state;
        }
    }
}