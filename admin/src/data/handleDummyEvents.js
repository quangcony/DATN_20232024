import crowdfundingApi from "../api/crowdfundingApi"

export const handleConfirmClick = async(state, data) => {
    try {
        if(state) {
            const res = await crowdfundingApi.updateCampaign(data._id, {status: "active"})
            if(res) alert("Dự án đã được chấp thuận!")
        }else {
            const res = await crowdfundingApi.updateCampaign(data._id, {status: "refused"})
            if(res) alert("Dự án không được chấp thuận!")
        }
    } catch (error) {
        console.log("Lỗi khi xác nhận dự án: ", error)
    }
    
}