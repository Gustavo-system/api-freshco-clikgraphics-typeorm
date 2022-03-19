
export const responseData = (res, status, message, data) => {
    return res.status(status || 200).send({
        success: true,
        message: message,
        data: data
    });
};

export const responseMessage = (res, status, b_estatus, message,data?) => {
    return res.status(status || 200).send({
        success: b_estatus,
        message: message,
        data
    });
};
