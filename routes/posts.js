let express = require('express');
let router = express.Router();
let response = require('./../tools/response_helper');
let commonHelper = require('./../tools/common_helpers');
let constants = require('./../tools/contants');
let fileHelper = require('./../tools/file_helper');

//IMPORTING MODELS
let jobsModel = require('./../models/jobs.model');
let userModel = require('./../models/users.model');
let applyJobModel = require('./../models/applied.jobs.model');

router.post('/', commonHelper.authenticateToken, (req, res) => {
    const { search } = req.body;
    let regexSearch = new RegExp(search, "i");
    jobsModel.find({
        status: 'active',
        $or: [{ position: regexSearch }, { tech: regexSearch }]
    }).select('-createdAt').populate('postCreatedBy', 'name -_id').lean().then((jobs) => {
        return response.success('posts!', jobs, res);
    }).catch((err) => {
        return response.internalError(err, res);
    });
});

router.post('/hrPosts', commonHelper.authenticateToken, (req, res) => {
    jobsModel.find({ status: 'active', postCreatedBy: req.token.userId }).select('-createdAt').populate('postCreatedBy', 'name -_id').lean().then((jobs) => {
        return response.success('posts!', jobs, res);
    }).catch((err) => {
        return response.internalError(err, res);
    });
});

router.post('/postById', commonHelper.authenticateToken, (req, res) => {
    const { jobId } = req.body;
    jobsModel.findById(jobId).select('-createdAt').lean().then((jobs) => {
        if (jobs != null) {
            return response.success('posts!', jobs, res);
        } else {
            return response.success('posts!', 0, res);
        }
    }).catch((err) => {
        return response.internalError(err, res);
    });
});

router.post('/create', commonHelper.authenticateToken, (req, res) => {
    let userId = req.token.userId;
    console.log(userId);
    userModel.findById(userId).lean().then((user) => {
        if (user != null) {
            if (user.type == 'hr') {
                const { id, position, tech, experience, vacancies, status } = req.body;
                if (id == "0" || id == null) {
                    let newJob = new jobsModel({
                        position: position,
                        tech: tech,
                        experience: experience,
                        vacancies: vacancies,
                        postCreatedBy: userId
                    });
                    newJob.save().then((saved) => {
                        return response.success('post created successfully', 1, res);
                    }).catch((err) => {
                        return response.internalError(err, res);
                    })
                } else {
                    jobsModel.findByIdAndUpdate(id, {
                        position: position,
                        tech: tech,
                        experience: experience,
                        vacancies: vacancies,
                        status: status
                    }, { new: true }).then((job) => {
                        if (job != null) {
                            return response.success('Post updated successfully!', 1, res);
                        } else {
                            return response.success('Unable to update post!', 0, res)
                        }
                    }).catch((err) => {
                        return response.internalError(err, res);
                    });
                }
            } else {
                return response.forbiddenRequest(res);
            }
        } else {
            return response.forbiddenRequest(res);
        }
    }).catch((err) => {
        return response.internalError(err, res);
    })
});

router.post('/apply', commonHelper.authenticateToken,
    fileHelper.serverStorage(constants.STORAGE_PATH).single('resume'), (req, res) => {
        let userId = req.token.userId;
        userModel.findById(userId).select('type -_id').lean().then((userType) => {
            if (userType != null) {
                if (userType.type == 'general') {
                    const { jobId, comments, status } = req.body;
                    jobsModel.findById(jobId).lean().then((job) => {
                        if (job != null && job.status == 'active') {
                            applyJobModel.findOne({ jobId: jobId, userId: userId }).then((alreadyApplied) => {
                                if (alreadyApplied != null) {
                                    return response.success('You had already applied for this post!', 0, res);
                                } else {
                                    let applyForJob = new applyJobModel({
                                        jobId: jobId,
                                        userId: userId,
                                        attachment: req.file != null ? req.file.path : "",
                                        comments: comments
                                    });
                                    applyForJob.save().then((saved) => {
                                        return response.success('Applied for job!', 1, res);
                                    }).catch((err) => {
                                        return response.internalError(err, res);
                                    });
                                }
                            }).catch((err) => {
                                return response.internalError(err, res);
                            })
                        } else {
                            return response.success('No post available for the following job!', 0, res);
                        }
                    }).catch((err) => {
                        return response.internalError(err, res);
                    });
                } else {
                    return response.forbiddenRequest(res);
                }
            } else {
                return response.success('User not found!', 0, res);
            }
        }).catch((err) => {
            return response.internalError(err, res);
        })
    });

router.post('/usersAppliedForJob', commonHelper.authenticateToken, (req, res) => {
    userModel.findById(req.token.userId).select('type -_id').lean().then((userType) => {
        if (userType != null && userType.type == 'hr') {
            jobsModel.find({}).select('_id').lean().then((results) => {
                let jobIds = [];
                results.some((ele, i) => jobIds.push(ele._id));
                applyJobModel.find({ jobId: { $in: jobIds } }).populate('jobId').populate('userId').then((result) => {
                    return response.success('List of candidates applied for jobs!', result, res);
                }).catch((err) => {
                    return response.internalError(err, res);
                });
            }).catch((err) => {
                return response.internalError(err, res);
            })
        } else {
            return response.forbiddenRequest(res);
        }
    }).catch((err) => {
        return response.internalError(err, res);
    })
});

module.exports = router;
