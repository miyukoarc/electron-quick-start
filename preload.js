// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMNodeInserted', () => {

    const electron = window.require('electron')
    window.electron = electron

    let interfaces = window.require('os').networkInterfaces()
    window.interfaces = interfaces
    // console.log(electron,'electron')
    // const express = require('express');
    // let proxy = require('http-proxy-middleware');

    // const app = express();

    // app.use(
    //     '/api',
    //     proxy({
    //         target: 'http://www.example.org',
    //         changeOrigin: true
    //     })
    // );
    // app.listen(3000, () => {
    //     console.log('node experss is running at port 3000')
    // });
})
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }

    //   const electron = require('electron')
    //   window.electron = electron
})