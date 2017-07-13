import Vue from 'vue'
import VueResource from 'vue-resource'
import {API_ROOT} from '../config'

Vue.use(VueResource)


export const HeightResource = Vue.resource(API_ROOT+ "?jsonrpc=2.0&method=getblockcount&params=[]&id=5")
