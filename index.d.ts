import {
  ObjectId,
  GridFSBucket, GridFSBucketWriteStream, GridFSBucketReadStream
} from 'mongodb';
import { Collection, Connection, Model } from 'mongoose';
import stream from 'stream';

/**
 * @name bucketName
 * @description Bucket name used to prefix 'files' and 'chunks' collections.
 * @return {String}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * const bucketName = bucket.bucketName;
 * //=> fs
 *
 */
declare var bucketName: string;

/**
 * @name collection
 * @description Collection used to store file data.
 * @return {Collection}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.6.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * const collection = bucket.collection;
 * //=> Collection { ... }
 *
 */
declare var collection: string;

/**
 * @name collectionName
 * @description Name of a collection used to store file.
 * @return {String}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.7.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * const collectionName = bucket.collectionName;
 * //=> fs.files
 *
 */
declare var collectionName: string;

/**
 * @function createWriteStream
 * @name createWriteStream
 * @description Creates a writable stream (GridFSBucketWriteStream) for writing
 * buffers to GridFS for a custom file id. The stream's 'id' property contains
 * the resulting file's id.
 * @param {Object} optns Valid options for write file.
 * @param {ObjectId} [optns._id] A custom id used to identify file doc.
 * @param {String} optns.filename The value of the 'filename' key in the files
 * doc.
 * @param {Number} [optns.chunkSizeBytes] Optional overwrite this bucket's
 * chunkSizeBytes for this file.
 * @param {Object} [optns.metadata] Optional object to store in the file
 * document's `metadata` field.
 * @param {String} [optns.contentType] Optional string to store in the file
 * document's `contentType` field.
 * @param {Array} [optns.aliases] Optional array of strings to store in the
 * file document's `aliases` field.
 * @param {Boolean} [optns.disableMD5=false] If true, disables adding an
 * md5 field to file data.
 * @return {GridFSBucketWriteStream}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * const _id = new ObjectId();
 * const filename = 'filename.txt';
 * const readStream = fs.createReadStream(filename);
 * const writeStream = bucket.createWriteStream({_id, filename});
 * readStream.pipe(writeStream);
 *
 */
declare function createWriteStream(optns: {
    _id?: ObjectId;
    filename: string;
    chunkSizeBytes?: number;
    metadata?: any;
    contentType?: string;
    aliases?: any[];
    disableMD5?: boolean;
}): GridFSBucketWriteStream;

/**
 * @function createReadStream
 * @name createReadStream
 * @description Creates a readable stream (GridFSBucketReadStream) for
 * streaming the file with the given name from GridFS. If there are multiple
 * files with the same name, this will stream the most recent file with the
 * given name (as determined by the `uploadDate` field). You can set the
 * `revision` option to change this behavior.
 * @param {Object} [optns] Valid options for read existing file.
 * @param {ObjectId} optns._id The id of the file doc
 * @param {String} [optns.filename] The name of the file doc to stream
 * @param {Number} [options.revision=-1] The revision number relative to the
 * oldest file with the given filename. 0 gets you the oldest file, 1 gets you
 * the 2nd oldest, -1 gets you the newest.
 * @param {Number} [optns.start] Optional 0-based offset in bytes to start
 * streaming from.
 * @param {Number} [optns.end] Optional 0-based offset in bytes to stop
 * streaming before.
 * @return {GridFSBucketReadStream}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * const _id = new ObjectId();
 * const filename = 'filename.txt';
 * const writeStream = fs.createWriteStream(filename);
 * const readStream = bucket.createReadStream({_id, filename});
 * readStream.pipe(writeStream);
 *
 */
declare function createReadStream(optns?: {
    _id: ObjectId;
    filename?: string;
    start?: number;
    end?: number;
}): GridFSBucketReadStream;

/**
 * @function writeFile
 * @name writeFile
 * @description Write provided file into MongoDB GridFS
 * @param {Object} file valid file details
 * @param {ReadableStream} readstream valid nodejs ReadableStream
 * @param {Function} [done] a callback to invoke on success or error
 * @fires GridFSBucketWriteStream#error
 * @fires GridFSBucketWriteStream#finish
 * @return {GridFSBucketWriteStream} a GridFSBucketWriteStream instance.
 * @see {@link https://docs.mongodb.com/manual/core/gridfs/}
 * @see {@link http://mongodb.github.io/node-mongodb-native}
 * @see {@link https://nodejs.org/api/stream.html#stream_writable_streams}
 * @see {@link https://nodejs.org/api/stream.html#stream_readable_streams}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * // large file
 * const bucket = createBucket();
 * const filename = 'filename.txt';
 * const readStream = fs.createReadStream(filename);
 * const writeStream = bucket.writeFile({ filename }, readStream);
 *
 * // small file
 * const bucket = createBucket();
 * const filename = 'filename.txt';
 * const readStream = fs.createReadStream(filename);
 * bucket.writeFile({ filename }, readStream, (error, file) => { ... });
 *
 */
declare function writeFile(file: any, readstream: ReadableStream, done?: (...params: any[]) => any): GridFSBucketWriteStream;

/**
 * @function readFile
 * @name readFile
 * @description Read file from MongoDB GridFS
 * @param {Object} optns valid criteria for read existing file.
 * @param {ObjectId} optns._id The id of the file doc
 * @param {String} [optns.filename] The name of the file doc to stream
 * @param {Number} [options.revision=-1] The revision number relative to the
 * oldest file with the given filename. 0 gets you the oldest file, 1 gets you
 * the 2nd oldest, -1 gets you the newest.
 * @param {Number} [optns.start] Optional 0-based offset in bytes to start
 * streaming from.
 * @param {Number} [optns.end] Optional 0-based offset in bytes to stop
 * streaming before.
 * @param {Function} [done] a callback to invoke on success or error.
 *
 * Warn!: Pass callback if filesize is small enough.
 * Otherwise consider using stream instead.
 *
 * @fires GridFSBucketReadStream#error
 * @fires GridFSBucketReadStream#file
 * @return {GridFSBucketReadStream} a GridFSBucketReadStream instance.
 * @see {@link https://docs.mongodb.com/manual/core/gridfs/}
 * @see {@link http://mongodb.github.io/node-mongodb-native}
 * @see {@link https://nodejs.org/api/stream.html#stream_writable_streams}
 * @see {@link https://nodejs.org/api/stream.html#stream_readable_streams}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * // large file
 * const bucket = createBucket();
 * const filename = 'filename.txt';
 * const readStream = bucket.readFile({ filename });
 *
 * // small file
 * const bucket = createBucket();
 * const filename = 'filename.txt';
 * bucket.readFile({ filename }, (error, buffer) => { ... });
 *
 */
declare function readFile(optns: {
    _id: ObjectId;
    filename?: string;
    start?: number;
    end?: number;
}, done?: (...params: any[]) => any): GridFSBucketReadStream;

/**
 * @function deleteFile
 * @name deleteFile
 * @alias unlink
 * @description Remove an existing file and its chunks.
 * @param {ObjectId} _id The id of the file doc
 * @param {Function} done a callback to invoke on success or error
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * bucket.deleteFile(_id, (error, results) => { ... });
 *
 */
declare function deleteFile(_id: ObjectId, done: (...params: any[]) => any): void;

/**
 * @function findOne
 * @name findOne
 * @description find an existing file using options provided
 * @param {Object} optns valid find criteria
 * @param {Function} done a callback to invoke on success or error
 * @return {Object} existing file details
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.7.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * bucket.findOne({ _id }, (error, file) => { ... });
 * bucket.findOne({ filename }, (error, file) => { ... });
 *
 */
declare function findOne(optns: any, done: (...params: any[]) => any): any;

/**
 * @function findById
 * @name findById
 * @description find an existing file with given objectid
 * @param {ObjectId} _id valid objectid of the existing file
 * @param {Function} done a callback to invoke on success or error
 * @return {Object} existing file details
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.7.0
 * @instance
 * @example
 *
 * const bucket = createBucket();
 * bucket.findById(_id, (error, file) => { ... });
 *
 */
declare function findById(_id: ObjectId, done: (...params: any[]) => any): any;

/**
 * @function _handleFile
 * @name _handleFile
 * @description write file to the bucket and return information on how to
 * access the file in the future
 * @param {Object} request injected request from multer
 * @param {Object} file injected file object from multer
 * @param {Function} done a callback to invoke on success or error
 * @author lally elias <lallyelias87@mail.com>
 * @see {@link https://github.com/expressjs/multer/blob/master/StorageEngine.md}
 * @since 0.1.0
 * @version 0.5.0
 * @instance
 * @example
 *
 * const express = require('express');
 * const multer  = require('multer');
 * const { createBucket } = require('mongoose-gridfs');
 * const app = express();
 * const storage = createBucket(); // createBucket(optns)
 * const upload = multer({ storage });
 *
 * app.post('/profile', upload.single('avatar'), (req, res, next) => {
 *   // req.file is the `avatar` file
 *   // req.body contains the text fields
 * });
 *
 */
declare function _handleFile(request: any, file: any, done: (...params: any[]) => any): void;

/**
 * @function _removeFile
 * @name _removeFile
 * @description remove existing file from bucket
 * @param {Object} request injected request from multer
 * @param {Object} file injected file object from multer
 * @param {Function} done a callback to invoke on success or error
 * @author lally elias <lallyelias87@mail.com>
 * @see {@link https://github.com/expressjs/multer/blob/master/StorageEngine.md}
 * @since 0.1.0
 * @version 0.7.0
 * @instance
 * @example
 *
 * const express = require('express');
 * const multer  = require('multer');
 * const { createBucket } = require('mongoose-gridfs');
 * const app = express();
 * const storage = createBucket(); // createBucket(optns)
 * const upload = multer({ storage });
 *
 * app.post('/profile', upload.single('avatar'), (req, res, next) => {
 *   // req.file is the `avatar` file
 *   // req.body contains the text fields
 * });
 *
 */
declare function _removeFile(request: any, file: any, done: (...params: any[]) => any): void;

/**
 * @function createBucket
 * @name createBucket
 * @description Create GridFSBucket
 * @param {Object} [optns] Optional settings.
 * @param {Connection} [optns.connection = mongoose.connection] A valid
 * instance of mongoose connection.
 * @param {String} [optns.bucketName="fs"] The 'files' and 'chunks' collections
 * will be prefixed with the bucket name followed by a dot.
 * @param {Number} [optns.chunkSizeBytes=255 * 1024] Number of bytes stored in
 * each chunk. Defaults to 255KB
 * @param {Object} [optns.writeConcern] Optional write concern to be passed to
 * write operations, for instance `{ w: 1 }`
 * @param {Object} [optns.readPreference] Optional read preference to be passed
 * to read operations
 * @return {GridFSBucket} an instance of GridFSBucket
 * @author lally elias <lallyelias87@mail.com>
 * @since 1.0.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * const bucket = createBucket();
 * const bucket = createBucket({ bucketName });
 * const bucket = createBucket({ buketName, connection });
 *
 */
declare function createBucket(optns?: {
    connection?: Connection;
    bucketName?: string;
    chunkSizeBytes?: number;
    writeConcern?: any;
    readPreference?: any;
}): GridFSBucket;

/**
 * @function createModel
 * @name createModel
 * @description Create GridFSBucket files collection model
 * @param {Object} [optns] Optional settings.
 * @param {Connection} [optns.connection = mongoose.connection] A valid instance
 * of mongoose connection.
 * @param {String} [optns.modelName="File"] Valid model name to use with
 * mongoose
 * @param {String} [optns.bucketName="fs"] The 'files' and 'chunks' collections
 * will be prefixed with the bucket name followed by a dot.
 * @param {Number} [optns.chunkSizeBytes=255 * 1024] Number of bytes stored in
 * each chunk. Defaults to 255KB
 * @param {Object} [optns.writeConcern] Optional write concern to be passed to
 * write operations, for instance `{ w: 1 }`
 * @param {Object} [optns.readPreference] Optional read preference to be passed
 * to read operations
 * @param {...Function} [plugins] list of valid mongoose plugin to apply to
 * file schema
 * @return {GridFSBucket} an instance of GridFSBucket
 * @author lally elias <lallyelias87@mail.com>
 * @since 1.0.0
 * @version 0.2.0
 * @public
 * @static
 * @example
 *
 * const File = createModel(); // => fs.files
 * const Photo = createModel({ modelName }); // => photos.files
 * const Photo = createModel({ modelName, connection }); // => photos.files
 *
 */
declare function createModel(optns?: {
    connection?: Connection;
    modelName?: string;
    bucketName?: string;
    chunkSizeBytes?: number;
    writeConcern?: any;
    readPreference?: any;
}, ...plugins?: ((...params: any[]) => any)[]): GridFSBucket;

/**
 * @function write
 * @name write
 * @description Write provided file into MongoDB GridFS
 * @param {stream.Readable} stream readable stream
 * @param {Function} [done] a callback to invoke in success or error
 * @return {Model} valid instance of mongoose model.
 * @see {@link https://docs.mongodb.com/manual/core/gridfs/}
 * @see {@link http://mongodb.github.io/node-mongodb-native}
 * @see {@link https://nodejs.org/api/stream.html#stream_writable_streams}
 * @see {@link https://nodejs.org/api/stream.html#stream_readable_streams}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * const attachment = new Attachment({ filename });
 * attachment.write(readablestream, (error, attached) => {
 *  //=> {_id: ..., filename: ..., ... }
 * });
 *
 */
declare function write(stream: stream.Readable, done?: (...params: any[]) => any): Model;

/**
 * @function read
 * @name read
 * @description Read file from MongoDB GridFS
 * @param {Number} [options.revision=-1] The revision number relative to the
 * oldest file with the given filename. 0 gets you the oldest file, 1 gets you
 * the 2nd oldest, -1 gets you the newest.
 * @param {Number} [optns.start] Optional 0-based offset in bytes to start
 * streaming from.
 * @param {Number} [optns.end] Optional 0-based offset in bytes to stop
 * streaming before.
 * @param {Function} [done] a callback to invoke on success or error.
 *
 * Warn!: Pass callback if filesize is small enough.
 * Otherwise consider using stream instead.
 *
 * @return {GridFSBucketReadStream} a GridFSBucketReadStream instance.
 * @see {@link https://docs.mongodb.com/manual/core/gridfs/}
 * @see {@link http://mongodb.github.io/node-mongodb-native}
 * @see {@link https://nodejs.org/api/stream.html#stream_writable_streams}
 * @see {@link https://nodejs.org/api/stream.html#stream_readable_streams}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * // small file
 * Attachment.findById(_id, (error, attachment) => {
 *   attachment.read((error, content) => { ... });
 * });
 *
 * // large file
 * Attachment.findById(_id, (error, attachment) => {
 *   const readstream = attachment.read();
 *   stream.on('error', fn);
 *   stream.on('data', fn);
 *   stream.on('close', fn);
 * });
 *
 */
declare function read(done?: (...params: any[]) => any): GridFSBucketReadStream;

/**
 * @function unlink
 * @name unlink
 * @alias unlink
 * @description Remove an existing file and its chunks.
 * @param {Function} done a callback to invoke on success or error
 * @return {Model} mongoose model instance
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * attachment.unlink((error, unlinked) => {
 *  //=> {_id: ..., filename: ..., ... }
 * });
 *
 */
declare function unlink(done: (...params: any[]) => any): Model;

/**
 * @function write
 * @name write
 * @description Write provided file into MongoDB GridFS
 * @param {stream.Readable} stream readable stream
 * @param {Function} [done] a callback to invoke in success or error
 * @return {Model} valid instance of mongoose model.
 * @see {@link https://docs.mongodb.com/manual/core/gridfs/}
 * @see {@link http://mongodb.github.io/node-mongodb-native}
 * @see {@link https://nodejs.org/api/stream.html#stream_writable_streams}
 * @see {@link https://nodejs.org/api/stream.html#stream_readable_streams}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * const attachment = new Attachment({ filename });
 * attachment.write(readablestream, (error, attached) => {
 *  //=> {_id: ..., filename: ..., ... }
 * });
 *
 */
declare function write(stream: stream.Readable, done?: (...params: any[]) => any): Model;

/**
 * @function read
 * @name read
 * @description Read file from MongoDB GridFS
 * @param {Number} [options.revision=-1] The revision number relative to the
 * oldest file with the given filename. 0 gets you the oldest file, 1 gets you
 * the 2nd oldest, -1 gets you the newest.
 * @param {Number} [optns.start] Optional 0-based offset in bytes to start
 * streaming from.
 * @param {Number} [optns.end] Optional 0-based offset in bytes to stop
 * streaming before.
 * @param {Function} [done] a callback to invoke on success or error.
 *
 * Warn!: Pass callback if filesize is small enough.
 * Otherwise consider using stream instead.
 *
 * @return {GridFSBucketReadStream} a GridFSBucketReadStream instance.
 * @see {@link https://docs.mongodb.com/manual/core/gridfs/}
 * @see {@link http://mongodb.github.io/node-mongodb-native}
 * @see {@link https://nodejs.org/api/stream.html#stream_writable_streams}
 * @see {@link https://nodejs.org/api/stream.html#stream_readable_streams}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * // small file
 * Attachment.findById(_id, (error, attachment) => {
 *   attachment.read((error, content) => { ... });
 * });
 *
 * // large file
 * Attachment.findById(_id, (error, attachment) => {
 *   const readstream = attachment.read();
 *   stream.on('error', fn);
 *   stream.on('data', fn);
 *   stream.on('close', fn);
 * });
 *
 */
declare function read(done?: (...params: any[]) => any): GridFSBucketReadStream;

/**
 * @function unlink
 * @name unlink
 * @alias unlink
 * @description Remove an existing file and its chunks.
 * @param {Function} done a callback to invoke on success or error
 * @return {Model} mongoose model instance
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * attachment.unlink((error, unlinked) => {
 *  //=> {_id: ..., filename: ..., ... }
 * });
 *
 */
declare function unlink(done: (...params: any[]) => any): Model;
