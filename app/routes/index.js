var router = require('express').Router();
var aws = require('aws-sdk');
var sharp = require('sharp');

var s3 = new aws.S3();

router.route('/:width/:height/:key(*).:ext')
    .get(
        (req, res, next) => {
            req.validate("width").notEmpty();
            req.validate("width").isInt();
            req.validate("height").notEmpty();
            req.validate("height").isInt();
            req.validate("key").notEmpty();
            req.validate("ext").notEmpty();

            req
                .getValidationResult()
                .then(result => {
                    if(!result.isEmpty())
                        return next({status: 400, errors: result.array()});

                    next();
                })
        },   
        (req, res, next) => {
            req.sanitize("width").toInt();
            req.sanitize("height").toInt();
            req.sanitize("key").trim();
            req.sanitize("ext").trim();
            req.sanitize("ext").toLowerCase();
            next();
        },
        (req, res, next) => {
            s3.getObject({
                Bucket: process.env.S3_BUCKET,
                Key: req.params.key
            }, (err, data) => {
                if(err) {
                    console.error(err);
                    return next({status: 500, code: "error_connecting_to_s3"});
                }

                if(!data)
                    return next({status: 404, code: "image_not_found"});

                sharp(data.Body)
                    .resize(req.params.width, req.params.height)
                    .toFormat(req.params.ext)
                    .toBuffer((err, data, info) => {
                        if(err)
                            return next({status: 500, code: "error_rendering_image"});

                        console.log(info);

                        res.send(data);
                    })
            })

    })

module.exports = router;