import { atom } from "recoil"


const pageParaminit = {
    page : 0,
    size : 12
}

const pageParam = () => ({
    key : 'pageParam',
    default : pageParaminit
})

export default pageParam