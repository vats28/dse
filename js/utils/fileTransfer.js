'use.strict'
/*
 * utils/fileTransfer.js
 *
 * deepanshu sharma
 */

angular.module('utils.fileTransfer', [])

    .factory('fileTransfer', function ($cordovaFileTransfer, $cordovaFile) {

        var directory = "";
        function createDirectory(callback, url, targetPath, options, trustHosts) {
            // CHECK
            //alert(0);
            targetPath = url.substring(url.lastIndexOf('/'));
            $cordovaFile.checkDir(cordova.file.dataDirectory, "product_app_dir")
                .then(function (success) {
                    // success
                    console.debug('directory created ' + JSON.stringify(success));

                    directory = success.nativeURL;
                    download(callback, url, directory + targetPath, options, trustHosts);
                }, function (error) {
                    // CREATE
                    $cordovaFile.createDir(cordova.file.dataDirectory, "product_app_dir", false)
                        .then(function (success) {
                            // success
                            console.debug('directory found ' + JSON.stringify(success));
                            directory = success.nativeURL;
                            download(callback, url, directory + targetPath, options, trustHosts);
                        }, function (error) {
                            console.debug(JSON.stringify(error));
                            callback(-1, error);
                        });
                });

        }
//(callback, url, folder_name, file_name);
        function createDir(callback, url, folder_name, file_name) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
                fileSys.root.getDirectory(folder_name, { create: true, exclusive: false },
                    function (directory) {
                        alert("directory created   " + JSON.stringify(directory));
                        console.log("Directory has been created");
                        fileSystemSuccess(callback, url, directory, file_name);
                    }, createError);
            }, createError);

            function createError(evt) {
                //Unable to access file system
                alert("File System Fail: " + evt.target.error.code);
            }
        }

        function download(callback, url, targetPath, options, trustHosts) {
            try {
                alert('url  '+url);
                if (url == null) {
                    callback(-1, 'parameters not supplied correctly !!');
                    return;
                }

                alert('targetPath  '+targetPath);
                $cordovaFileTransfer.download(url, targetPath)//, options, trustHosts)
                    .then(function (result) {
                        // Success!
                        console.debug('Success ' + JSON.stringify(result));;
                        callback(result);
                    }, function (err) {
                        // Error
                        console.debug(JSON.stringify(err));
                        callback(-1, err);
                    }, function (progress) {

                        //console.log(JSON.stringify(progress));
                        var downloadProgress = (progress.loaded / progress.total) * 100;
                        callback(-2, downloadProgress);
                    });

                //alert(2);
            } catch (err) {
                callback(-1, err);
            }
        }


        function downloadInOuterDirectory(callback, url, folder_name, file_name) {
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
            createDir(callback, url, folder_name, file_name);
        }//end
        
        function fileSystemSuccess(callback, url, directory, file_name) {
            try {
                var download_link = encodeURI(url);
                // var directoryEntry = fileSystem.root.toURL();//fileSystem.root; // to get root path of directory
                // alert('directoryEntry  ' + directoryEntry);
                // var platform = device.platform.toLowerCase();//'android';//
                // alert('platform  ' + platform);
                // if (platform == 'android') {
                //     directoryEntry = fileSystem.root;
                //     directoryEntry.getDirectory(folder_name, {
                //         create: true,
                //         exclusive: false
                //     }, function (parent) {
                //         //success
                //         alert('Parent' + JSON.stringify(parent));
                //     }, function (error) {
                //         //error
                //         alert("Unable to create new directory: " + error);
                //     });
                //     alert('2   ');
                // }// creating folder in sdcard
                // var fp = directoryEntry.nativeURL;// directoryEntry.nativeURL;//cordova.file.externalRootDirectory;// rootdir.fullPath; // Returns Fulpath of local directory
                // alert('3  ' + fp);
                // fp = fp + folder_name + "/" + file_name;
                // alert('4   ' + fp);
                // download function call
                download(callback, download_link, directory.nativeURL + '/' + file_name);
            } catch (err) {
                alert('fileSystem' + err);
            }
        }//end fileSystemSuccess
            
        function fileSystemFail(evt) {
            //Unable to access file system
            alert("File System Fail: " + evt.target.error.code);
        }

        function upload(callback, server, filePath, options) {
            try {
                $cordovaFileTransfer.upload(server, filePath, options)
                    .then(function (result) {
                        // Success!
                        callback(result);
                    }, function (err) {
                        // Error
                        callback(-1, err);
                    }, function (progress) {
                        // constant progress updates
                        //alert(JSON.stringify(progress));
                        var uploadProgress = (progress.loaded / progress.total) * 100;
                        //alert(uploadProgress);
                        callback(-2, uploadProgress);
                    });
            } catch (err) {
                callback(-1, err);
            }
        }

        return {
            downloadFile: function (callback, url, targetPath, options) {
                createDirectory(callback, url, targetPath, options, true);
            },
            uploadFile: function (callback, server, filePath, options) {
                upload(callback, server, filePath, options)
            },
            downloadInOuterDirectory: function (callback, url, folder_name, file_name) {
                downloadInOuterDirectory(callback, url, folder_name, file_name);
            }
        }
    });
