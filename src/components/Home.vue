<template>
  <div>
    <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">AntShares</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Language <span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
              <li :class="{'active': language == 'csharp'}"><a @click="changeLanguage('csharp')">CSharp</a></li>
              <li :class="{'active': language == 'java'}"><a @click="changeLanguage('java')">Java</a></li>
              <li :class="{'active': language == 'solidity'}"><a @click="changeLanguage('solidity')">Solidity</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Theme <span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
              <li :class="{'active': theme == 'vs'}"><a @click="changeTheme('vs')">Visual Studio</a></li>
              <li :class="{'active': theme == 'vs-dark'}"><a @click="changeTheme('vs-dark')">Visual Studio Dark</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Font <span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
              <li :class="{'active': size == '14'}"><a @click="changeFontSize('14')">14</a></li>
              <li :class="{'active': size == '16'}"><a @click="changeFontSize('16')">16</a></li>
              <li :class="{'active': size == '18'}"><a @click="changeFontSize('18')">18</a></li>
              <li :class="{'active': size == '20'}"><a @click="changeFontSize('20')">20</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Example <span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
              <li v-for="(item, i) in examples" :class="{'active': index == i}"><a @click="loadExample(i)">{{item.name}}</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div style="margin-top:62px;"></div>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h1 class="panel-title">Code Editor</h1>
      <i class="fa fa-play fa-2" :class="isRunning?'run':'stop'" @click="run" aria-hidden="true" style="position:absolute;display: block;right:20px;margin-top: -24px;"></i>
    </div>
    <div class="panel-body">
      <div id="container"></div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h1 class="panel-title">Compiler Output</h1>
    </div>
    <div class="panel-body">
      <form class="form-horizontal">
        <fieldset>
          <div class="form-group" v-if="result.hex">
            <label class="col-lg-1 control-label">AVMHex:</label>
            <div class="col-lg-11">
              <input type="text" class="form-control" :value="result.hex">
            </div>
          </div>
          <div v-for="item in result.errors">
            <div class="form-group" >
              <label class="col-lg-1 control-label">Error:</label>
              <div class="col-lg-11">
                <span class="label label-default">Line:{{item.line}}, ErrMsg:{{item.msg}}</span>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h1 class="panel-title">Transaction</h1>
    </div>
    <div class="panel-body">
      <ul class="nav nav-tabs">
        <li class="active"><a href="#home" data-toggle="tab" aria-expanded="true">Deploy Transaction</a></li>
        <li class=""><a href="#profile" data-toggle="tab" aria-expanded="true">Invoke Transaction</a></li>
      </ul>
      <div class="tab-content" style="margin-top: 20px;">
        <div class="tab-pane active fade in" id="home">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h1 class="panel-title">Transaction Content:</h1>
            </div>
            <div class="panel-body">
              <vue-form :state="deployState" v-model="deployState" @submit.prevent="deployTransaction">
                <div class="form-horizontal">
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.code)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Code*</label>
                      <div class="col-lg-11">
                        <input type="text" name="code" class="form-control" required v-model="code.Code"  placeholder="contract code">
                      </div>
                    </div>
                  </validate>
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.name)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Name*</label>
                      <div class="col-lg-11">
                        <input type="text" name="name" class="form-control" required v-model="deploy.Name" placeholder="contract name">
                      </div>
                    </div>
                  </validate>
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.author)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Author*</label>
                      <div class="col-lg-11">
                        <input type="text" name="author" class="form-control" required v-model="deploy.Author" placeholder="your name">
                      </div>
                    </div>
                  </validate>
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.email)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Email*</label>
                      <div class="col-lg-11">
                        <input type="email" name="email" class="form-control" required v-model="deploy.Email" placeholder="your email">
                      </div>
                    </div>
                  </validate>
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.codeVersion)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Code Version *</label>
                      <div class="col-lg-11">
                        <input type="text" name="codeVersion" class="form-control" required v-model="deploy.CodeVersion" placeholder="contract version">
                      </div>
                    </div>
                  </validate>
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.contract)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Contract*</label>
                      <div class="col-lg-11">
                        <input type="text" class="form-control" name="contract" required v-model="deploy.Contract" placeholder="contract content">
                      </div>
                    </div>
                  </validate>
                    <div class="form-group" v-show="language == 'solidity'">
                      <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.abi)">
                        <label class="col-lg-1 control-label">ABI*</label>
                        <div class="col-lg-11">
                          <input type="text" name="abi" class="form-control" v-model="deploy.ABI" required="language == 'solidity' ? 'required': 'none'" placeholder="application binary interface">
                        </div>
                    </validate>
                  </div>
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.language)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Language*</label>
                      <div class="col-lg-11">
                        <input type="text" class="form-control" name="language" required v-model="deploy.Language" placeholder="compiler contract language">
                      </div>
                    </div>
                  </validate>
                  <div class="form-group" v-show="language != 'solidity'">
                    <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.parameterTypes)">
                      <label class="col-lg-1 control-label">Parameter Types*</label>
                      <div class="col-lg-11">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="00" v-model="parameterTypes"> Signature
                          </label>
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="01" v-model="parameterTypes"> Boolean
                          </label>
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="02" v-model="parameterTypes"> Integer
                          </label>
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="03" v-model="parameterTypes"> Hash160
                          </label>
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="04" v-model="parameterTypes"> Hash256
                          </label>
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="05" v-model="parameterTypes"> ByteArray
                          </label>
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="06" v-model="parameterTypes"> PublicKey
                          </label>
                          <label>
                            <input type="checkbox" name="parameterTypes" required="language != 'solidity' ? 'required': 'none'" value="ff" v-model="parameterTypes"> Void
                          </label>
                        </div>
                      </div>
                    </validate>
                  </div>
                  <div class="form-group" v-show="language != 'solidity'">
                    <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.returnType)">
                      <label class="col-lg-1 control-label">Return Type*</label>
                        <div class="col-lg-11">
                          <select class="form-control" name="returnType" v-model="code.ReturnType" required="language != 'solidity' ? 'required': 'none'">
                            <option value="00">Signature</option>
                            <option value="01">Boolean</option>
                            <option value="02">Integer</option>
                            <option value="03">Hash160</option>
                            <option value="04">Hash256</option>
                            <option value="05">ByteArray</option>
                            <option value="06">PublicKey</option>
                            <option value="ff">Void</option>
                          </select>
                      </div>
                     </validate>
                  </div>
                  <validate auto-label class="form-group required-field" :class="fieldClassName(deployState.description)">
                    <div class="form-group">
                      <label class="col-lg-1 control-label" >Description*</label>
                      <div class="col-lg-11">
                        <textarea class="form-control" rows="3" name="description" required maxlength="200" minlength="20" v-model="deploy.Description" placeholder="more than 20 characters,less than 200 characters"></textarea>
                      </div>
                    </div>
                  </validate>
                  <div class="form-group">
                    <div class="col-lg-12 text-center">
                      <button type="reset" class="btn btn-default">Cancel</button>
                      <button type="submit" class="btn btn-success">Deploy</button>
                    </div>
                  </div>
                </div>
              </vue-form>
            </div>
          </div>
          <div class="panel panel-default">
            <div class="panel-heading">
              <h1 class="panel-title">Execute Result:</h1>
            </div>
            <div class="panel-body">
              <div class="form-group">
                <label class="col-lg-1 control-label">Transaction Id:</label>
                <div class="col-lg-11">
                  <input type="text" class="form-control" v-model="deploy.Language" placeholder="transaction id">
                </div>
              </div>
            </div>
            <div class="panel-body">
              <div class="form-group">
                <label class="col-lg-1 control-label">CodeHash:</label>
                <div class="col-lg-11">
                  <input type="text" class="form-control" v-model="deploy.Language" placeholder="code hash">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="profile">
          <div class="tab-pane active fade in">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h1 class="panel-title">Transaction Content:</h1>
              </div>
              <div class="panel-body">
                <form class="form-horizontal">
                  <fieldset>
                    <div class="form-group">
                      <label class="col-lg-1 control-label">CodeHash:</label>
                      <div class="col-lg-11">
                        <div class="input-group">
                          <input type="text" class="form-control" :value="invoke.CodeHash" placeholder="code hash">
                          <span class="input-group-btn">
                            <button class="btn btn-default" type="button"><icon class="glyphicon glyphicon-search"></icon></button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-lg-1 control-label">Params:</label>
                      <div class="col-lg-11">
                        <input type="text" class="form-control" :value="invoke.Params" placeholder="invoke params">
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-lg-12 text-center">
                        <button type="reset" class="btn btn-default">Cancel</button>
                        <button type="submit" class="btn btn-success">Invoke</button>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <h1 class="panel-title">Execute Result:</h1>
              </div>
              <div class="panel-body">
                <div class="form-group">
                  <label class="col-lg-1 control-label">Transaction Id:</label>
                  <div class="col-lg-11">
                    <input type="text" class="form-control" v-model="deploy.Language" placeholder="transaction id">
                  </div>
                </div>
              </div>
              <div class="panel-body">
                <div class="form-group">
                  <label class="col-lg-1 control-label">CodeHash:</label>
                  <div class="col-lg-11">
                    <input type="text" class="form-control" v-model="deploy.Language" placeholder="code hash">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style>
    .fa {
      margin-left: 10px;
      cursor: pointer;
    }
    .run {
      color: green
    }
    .stop {
      color: gray
    }
    .fa-2 {
      font-size: 2em;
    }
    .fa-3 {
      font-size: 3em;
    }
    .fa-4 {
      font-size: 4em;
    }
    .content {
      font: 400 14px/1.4em "Segoe UI","Open Sans",Calibri,Candara,Arial,sans-serif;
    }
    #container {
      min-height:400px;
      border:1px solid #eee
    }
    .m-t-10 {
      margin-top: 10px;
    }
    .m-t-20 {
      margin-top: 20px;
    }
    .p-l-15 {
      padding-left: 15px;
    }
    .p-r-15 {
      padding-right: 15px;
    }
    .myContentClass {
	     background: #FF7F00;
    }
    div.handler {
        height: 3px;
        cursor: row-resize;
        background-color: gray;
        z-index:1;
    }
    .red {
      color: #d9534f;
    }
    .has-danger {
      color: #d9534f;
    }
    .has-danger .form-control,
    .has-danger .form-control:focus{
      border: 1px solid #d9534f;
    }
    .has-success .form-control,
    .has-success .form-control:focus{
      border: 1px solid #18BCA0;
    }
    .fui-search:before {
      content: "\e630";
    }
</style>
<script>
  var options = {
    inputClasses: {
      valid: 'form-control-success',
      invalid: 'form-control-danger'
    }
  }
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import VueForm from 'vue-form'
  import {examples_config, languageDict} from '../config'
  export default {
    data: function() {
      return {
        deployState: {},
        theme: 'vs',
        size: '14',
        language: 'csharp',
        isRunning: true,
        result: {},
        index: 0,
        examples: [],
        deploy: {
          Name: '',
          Author: '',
          Email: '',
          CodeVersion: '',
          Contract: '',
          Language: '',
          Description: '',
          returnType: '',
          ABI: '',
        },
        invoke: {},
        code: {
            Code: '',
            ReturnType: '',

        },
        parameterTypes: [],

      }
    },
    components: {

    },
    mixins: [new VueForm(options)],
    created() {
    },
    mounted(){
      this.loadEditor(this.editor)
      this.examples = examples_config[this.language]
    },
    methods: {
      loadEditor: function() {
        window.onload = function() {
          Vue.editor = monaco.editor.create(document.getElementById('container'), {
            value: [
                'using AntShares.SmartContract.Framework;',
                'using AntShares.SmartContract.Framework.Services.AntShares;',
                'using AntShares.SmartContract.Framework.Services.System;',
                '',
                'class A : FunctionCode',
                '{',
                '    public static int Main() ',
                '    {',
                '        return 1;',
                '    }',
                '}',
            ].join('\n'),
            language: 'csharp',
            fontSize: 14,
          });
        }
      },
      changeLanguage: function(language) {
        Vue.editor.updateOptions({ 'language' : language });
        this.language = language
        this.examples = examples_config[this.language]
        this.loadExample(0)
      },
      changeTheme: function(theme) {
    		Vue.editor.updateOptions({ 'theme' : theme });
        this.theme = theme
      },
      changeFontSize: function(size) {
        Vue.editor.updateOptions({ 'fontSize' : size });
        this.size = size
      },
      loadExample: function(index) {
        Vue.editor.setValue(this.examples[index].context)
        this.index = index
      },
      writeVarUint: function(num) {
          if(num < 0xFD) {
            var arr = new ArrayBuffer(1);
            var view = new DataView(arr);
            view.setUint8(0, num, true);
            return arr;
          }
      },
      codeToStr: function() {
        var str = ""
        str += this.code.ReturnType
        str += this.hexNum(this.parameterTypes.length)
        str += this.arrToHexString(this.parameterTypes)
        str += this.hexNum(this.code.Code.length / 2)
        str += this.code.Code
        return str
      },
      deployToStr: function() {
          var str = ''
          str += this.codeToStr()
          if(this.deploy.Params && this.deploy.Params.length > 0) {

          }else {
            str += "00";
          }
          str += this.hexString(this.deploy.Name)
          str += this.hexString(this.deploy.CodeVersion)
          str += this.hexString(this.deploy.Author)
          str += this.hexString(this.deploy.Email)
          str += this.hexString(this.deploy.Contract)
          str += this.hexString(this.deploy.Description)
          str += languageDict[this.deploy.Language]
          str += "00";
          return str
      },
      fieldClassName: function (field) {
        if(!field) {
          return '';
        }
        if((field.$touched || field.$submitted) && field.$valid) {
          return 'has-success';
        }
        if((field.$touched || field.$submitted) && field.$invalid) {
          return 'has-danger';
        }
      },
      hexString: function(str) {
        var s = ""
        var arr = this.stringToUtf8Array(str)
        s += this.hexNum(arr.length)
        s += this.arrToHex(arr)
        return s
      },
      hexNum: function(num) {
          return this.toHex(num.toString(16))
      },
      deployTransaction: function() {
        if(this.deployState.$invalid) {
          return false;
        }
        var url = "http://192.168.1.155:11334/api/v1/transaction"
        var data = ""
        data += "d0"
        data += "00"
        data += this.deployToStr()
        data += "00" + "00" + "00"
        console.log("test", this.deployToStr())
        console.log(data);
      },
      arrToHexString: function(arr) {
        var str = ""
        for(var i = 0; i< arr.length; i++) {
          str += arr[i]
        }
        return str
      },
      toHex: function(str) {
        var s = str.length == 0 ? "00" :
          str.length == 1 ? "0" + str :
            str;
        return s
      },
      hexToString: function(str) {
        var trimedStr = str.trim();
        var rawStr =
          trimedStr.substr(0,2).toLowerCase() === "0x"
            ?
            trimedStr.substr(2)
            :
            trimedStr;
        var len = rawStr.length;
        if(len % 2 !== 0) {
          alert("Illegal Format ASCII Code!");
          return "";
        }
        var curCharCode;
        var resultStr = [];
        for(var i = 0; i < len;i = i + 2) {
          curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
          resultStr.push(String.fromCharCode(curCharCode));
        }
        return resultStr.join("");
      },
      arrToHex: function (arr) {
        var hex = [];
        for(var i = 0; i < arr.length; i++) {
          hex.push(this.toHex(arr[i].toString(16)));
        }
        return hex.join("");
      },
      stringToBytes: function(str) {
        var ch, st, re = [];
        for (var i = 0; i < str.length; i++ ) {
          ch = str.charCodeAt(i);  // get char
          st = [];                 // set up "stack"
          do {
            st.push( ch & 0xFF );  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
          }
          while ( ch );
          // add stack contents to result
          // done because chars have "wrong" endianness
          re = re.concat( st.reverse() );
        }
        // return an array of bytes
        return re;
      },
      run: function() {
        if(this.isRunning) {
          this.result = {}
          this.isRunning = false
          var url = "http://40.125.201.127:8080/_api/parse"
          var fdata = new FormData();
          fdata.append("language", this.language);
          fdata.append("file", this.file_str2blob(Vue.editor.getValue()));
          Vue.http.post(url, fdata).then(response => {
              this.result = response.body
              if(this.result.tag == 0) {
                this.result.flag = "compiler success!"
              }else{
                this.result.flag = "compiler fail!"
                for(var i=0;i<this.result.errors.length;i++){
                  var error = this.result.errors[i]
                  var line = error.line
                  Vue.editor.deltaDecorations([], [
                  {
                      range: new monaco.Range(line, 1, line, 1),
                      options: {
                        isWholeLine: true,
                        className: 'myContentClass',
                      }
                    }
                  ]);
                }
              }
              this.isRunning = true
              this.code.Code = this.result.hex
              this.deploy.Contract = Vue.editor.getValue()
              this.deploy.Language = this.language
            }, response => {
             alert("系统错误!")
          })
        }
      },
      stringToUtf8Array: function(str) {
          var bstr = [];
          for (var i = 0; i < str.length; i++) {
              var c = str.charAt(i);
              var cc = c.charCodeAt(0);
              if (cc > 0xFFFF) {
                  throw new Error("InvalidCharacterError");
              }
              if (cc > 0x80) {
                  if (cc < 0x07FF) {
                      var c1 = (cc >>> 6) | 0xC0;
                      var c2 = (cc & 0x3F) | 0x80;
                      bstr.push(c1, c2);
                  }
                  else {
                      var c1 = (cc >>> 12) | 0xE0;
                      var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                      var c3 = (cc & 0x3F) | 0x80;
                      bstr.push(c1, c2, c3);
                  }
              }
              else {
                  bstr.push(cc);
              }
          }
          return bstr;
      },
      file_str2blob: function(string) {
          var u8 = new Uint8Array(this.stringToUtf8Array(string));
          var blob = new Blob([u8]);
          return blob;
      }
    }
  }
</script>
