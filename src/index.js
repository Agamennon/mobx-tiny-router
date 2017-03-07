import Route from './files/route';
import RouterStore from './files/routerStore';
import startRouter from './files/startRouter';


function create(){
    return {
        Route,
        RouterStore,
        startRouter
    }
}

//components
//import MobxRouter from './src/components/MobxRouter';
//import Link from './src/components/Link';
//module.exports = create();

 export {Route, RouterStore, startRouter};
//export {Route};




/*

import {extendObservable, observable, action} from 'mobx'
import queryString from 'query-string'
import React, { Component } from 'react';

import startRouter from './routerStart';

import router from './routerStore';


startRouter();


const propsToMirror = [
    'hash',
    'host',
    'hostname',
    'href',
    'origin',
    'pathname',
    'port',
    'protocol',
    'search'
]

const createSnapshot = function () {
    const snapshot = propsToMirror.reduce((snapshot, prop) => {
            snapshot[prop] = window.location[prop]
            return snapshot
        }, {})
    snapshot.query = queryString.parse(snapshot.search)
    return snapshot
}
const firstSnapshot = createSnapshot()
const locationObservable = observable(firstSnapshot)

window.addEventListener('popstate', action('popstateHandler', (ev) => {

        extendObservable(locationObservable, createSnapshot())
}))

export default locationObservable*/
