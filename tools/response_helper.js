exports.success = (message, result, res) => {
    res.status(200).json({
        Message: message,
        Data: result,
        Status: 200,
        IsSuccess: true
    });
}

exports.badRequest = (message, res) => {
    res.status(400).json({
        Message: message,
        Data: 0,
        Status: 400,
        IsSuccess: false
    });
}

exports.internalError = (error, res) => {
    console.log(error.message);
    res.status(500).json({
        Message: error.message,
        Data: 0,
        Status: 500,
        IsSuccess: false
    });
}

exports.unauthorisedRequest = (res) => {
    res.status(401).json({
        Message: "Unauthorized Request!",
        Data: 0,
        Status: 401,
        IsSuccess: false
    });
}

exports.forbiddenRequest = (res) => {
    res.status(403).json({
        Message: "Access to the requested resource is forbidden! Contact Administrator.",
        Data: 0,
        Status: 403,
        IsSuccess: false
    });
}

