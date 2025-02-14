import React, { useEffect, useState } from 'react';
import '../Css/Send.css';
import axios from 'axios';  // Axios-г импортлох
import Result from './Result';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router-dom';

function Send() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const itemId = searchParams.get('itemId'); // Get the itemId from the URL
  
    console.log(itemId); // Use the itemId for your logic here
  
    const [sendState, setSendState] = useState({
        PROGRESS: 0,
        FILES: [],
        SIZE: 5e6,
        UPLOADED: false,
        URL: '',
    });
    const [redirect, setRedirect] = useState({
        sendRedirect: false,
        recieveRedirect: false,
        loginRedirect: false,
    });

    useEffect(() => {
        const username = sessionStorage.getItem('sid');
        if (!username) {
            setRedirect((prev) => ({ ...prev, loginRedirect: true }));
        }
    }, []);

    if (redirect.loginRedirect) {
        return <Navigate to="/login" />;
    }

    const random = () => {
        var result = '';
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        result += String(Math.floor(Math.random() * 100) + 1);
        for (var i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        result += String(Math.floor(Math.random() * 100) + 1);
        return result;
    };

    const upload = async () => {
        let len = sendState.FILES.length;
        if (len === 0) {
            document.getElementById('alert').style.display = 'block';
            document.getElementById('alert').innerHTML = 'Please Select atleast 1 file';
            setTimeout(function () {
                document.getElementById('alert').style.display = 'none';
            }, 1000);
        } else {
            try {
                let formData = new FormData(); // FormData объект үүсгэх
                formData.append('itemId', itemId);  // `itemId`-ийг өгөгдөлд нэмэх
                for (let file of sendState.FILES) {
                    formData.append('files', file);  // `files` нэртэйгээр файлыг нэмэх
                }

                // Сервер руу API хүсэлт илгээх
                const response = await axios.post('http://localhost:3010/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',  // Үүнийг заавал тохируулах
                    },
                    onUploadProgress: (progressEvent) => {
                        let progress = (progressEvent.loaded / progressEvent.total) * 100;
                        setSendState((prev) => ({
                            ...prev,
                            PROGRESS: progress,
                        }));
                    },
                });

                if (response.data.status === 'success') {
                    setSendState((prev) => ({
                        ...prev,
                        UPLOADED: true,
                        URL: response.data.result.fileUrl,  // Серверээс буцаж ирсэн файлын URL
                    }));
                } else {
                    throw new Error('File upload failed');
                }
            } catch (err) {
                console.log(err);
                document.getElementById('alert').style.display = 'block';
                document.getElementById('alert').innerHTML = 'Sorry, we are facing some problem!!';
                setTimeout(function () {
                    document.getElementById('alert').style.display = 'none';
                }, 3000);
            }
        }
    };

    const filepick = () => {
        try {
            let input = document.createElement('input');
            input.type = 'file';
            input.multiple = 'multiple';
            input.onchange = (e) => {
                var files = e.target.files;
                for (let file of files) {
                    let size = file.size;
                    let oldVal = sendState.SIZE;
                    if (oldVal - size >= 0 && size <= 10 * 1e9) { // 10GB
                        sendState.FILES.push(file);
                        setSendState((prev) => ({
                            ...prev,
                            SIZE: parseFloat(oldVal) - parseFloat(size),
                        }));
                        let list = document.createElement('LI');
                        let node = document.createTextNode(
                            String(file.name.slice(0, 20)) + '.....' + '(' + String((size / 1e9).toFixed(2)) + ' GB)'
                        );
                        list.appendChild(node);
                        document.getElementById('filedisplaylist').appendChild(list);
                    } else if (size > 10 * 1e9) {
                        document.getElementById('alert').style.display = 'block';
                        document.getElementById('alert').innerHTML = 'Your file exceeds the 10GB limit!!!';
                        setTimeout(function () {
                            document.getElementById('alert').style.display = 'none';
                        }, 2000);
                    }
                }
            };
            input.click();
        } catch (err) {
            console.log(err);
        }
    };

    const removeFile = (e) => {
        let tgt = e.target;
        if (tgt.tagName.toUpperCase() === 'LI') {
            let nodes = Array.from(tgt.parentNode.children);
            let index = nodes.indexOf(tgt);
            let file = sendState.FILES;
            let filesize = file.slice(index, index + 1)[0].size;
            file.splice(index, 1);
            let oldSize = sendState.SIZE;
            setSendState((prev) => ({
                ...prev,
                SIZE: parseFloat(oldSize) + parseFloat(filesize),
                FILES: file,
            }));
            tgt.parentNode.removeChild(tgt);
        }
    };

    if (sendState.UPLOADED === false) {
        return (
            <div className="send">
                <div className="imgPanel">
                    <img
                        src={require('./image/send-file.jpg')}
                        width={'600px'}
                        height={'100%'}
                        alt="sending a file"
                        title="sending a file"
                        className="sendImage"
                    />
                </div>
                <div className="filePicker">
                    <div className="filePicker-content">
                        <img
                            src={require('./image/add-file.png')}
                            width="100px"
                            alt="add a file"
                            title="add a file"
                            onClick={filepick}
                        />
                        <h5>Add Files</h5>
                        <button id="upload" onClick={upload}>
                            Upload
                        </button>
                        <progress
                            id="statusIndicatorSend"
                            value={sendState.PROGRESS}
                            max="100"
                        />
                        <div className="filedisplay">
                            <h5>Add more files</h5>
                            <p
                                style={{
                                    borderBottom: '1px solid grey',
                                    marginBottom: '0',
                                }}
                                className="fileInfo"
                            >
                                {sendState.FILES.length} files added -{' '}{(sendState.SIZE / 1e6).toFixed(2)} MB remaining
                            </p>
                            <p style={{ fontSize: '12px' }}>click to remove files</p>
                            <ul
                                id="filedisplaylist"
                                style={{ marginTop: '20px', padding: '0px' }}
                                onClick={removeFile}
                            ></ul>
                        </div>
                    </div>
                </div>
                <div color="danger" id="alert"></div>
            </div>
        );
    } else if (sendState.UPLOADED === true && sendState.URL.length > 0) {
        return <Result url={sendState.URL} />;
    }
}

export default Send;
