// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//             .catch((err) => next(err))
// Promis is an object that repesent the eventual comletion or faliuar of an asyncronus opraton
//     }
// }

// export { asyncHandler }


// const asyncHandler = (fn) =>()=>{}
// export {asyncHandler}

const asyncHendler = (fn) => async (req, res, next) =>{
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success : false,
            message : error.message
        })
    }
}