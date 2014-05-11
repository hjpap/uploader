(function(window){
	/*
		ops = {
			url:"",
			data:"",
			files:"",

			onprogress:"",
			onsucess:"",
			onfail:"",
			ontimeout:"",
			onabort:fn,
		}
	*/
	var self;
	function isSupport() {
        return (typeof FileReader !== 'undefined') && (typeof FormData !=='undefined');
    }

    function evalFunction(fn, args) {
        if (typeof fn === 'function') {
            fn(args);
        }
    }

	var Uploader = function(ops){
		if(!ops || !ops.url){
			return;
		}
		self = this;
		self._url = ops.url;
		self._data = ops.data;
		self._files = ops.files;

		self.onsupport = ops.onsupport || {};
		self.onprogress = ops.onprogress || {};
		self.onsucess = ops.onsucess || {};
		self.onfail = ops.onfail || {};
		self.ontimeout = ops.ontimeout || {};
		self.onabort = ops.onabort || {};


		self._xhr = null;

		self.init();
	}

	Uploader.prototype = {
		init:function(){
			if(!isSupport()){
				evalFunction(self.onsupport);
				console.log("Your browser doesn't support uploader.");
				throw e;
			}
			self._xhr = new XMLHttpRequest();
			self._formData = new FormData();
			self.bindEvents();
		},
		bindEvents:function(){
			self._xhr.upload.ontimeout = function(e){
				evalFunction(self.ontimeout,e);
			};
			self._xhr.upload.onprogress = function(e){
				if(e.lengthComputable){
					var nowDate = new Date().getTime();
                    var x = (e.loaded) / 1024;
                    var y = (nowDate - startDate) / 1000;
                    var speed = (x / y);
                    if(speed>1024){
                    	speed = (speed/1024).toFixed(2) + " M\/S";
                    }else{
                    	speed = speed.toFixed(2) + " K\/S";
                    }
		        	var percentage = (e.loaded / e.total) * 100;
		        	evalFunction(self.onprogress,{e:e,percentage:percentage,speed:speed});
		        }
			};
			self._xhr.onerror = function(e) {
		      	evalFunction(self.onfail,e);
		    };
		    self._xhr.onabort = function(e){
		    	evalFunction(self.onabort,e);
		    };
		    self._xhr.onreadystatechange = function(){
		    	if(self._xhr.readyState == 4){
			        //** Http状态码
			        //** 1xx ：信息展示
			        //** 2xx ：成功
			        //** 3xx ：重定向
			        //** 4xx : 客户端错误
			        //** 5xx ：服务器端错误
			        if(self._xhr.status == 200){
		                evalFunction(self.onsucess,self._xhr.responseText);
			        } else {
			        	//abort  --  0
			        	evalFunction(self.onfail,self._xhr.status);
			        }
			    }
		    }
		},
		send: function(){
			if(self._xhr == null || self._formData == null){
				self.init();
			}
			self.addDataToFormData();
			self.addFileToFormData();
			self._xhr.open('post', self._url, true);
			self._xhr.send(formData);
		},
		abort: function(callback){
			if(self._xhr){
				if(typeof callback == "function"){
					self._xhr.onabort = callback;
				}
				self._xhr.abort();
			}
		},
		addDataToFormData: function (formData) {
            if (self._data && self._formData) {
                for (var item in self._data) {
                    self._formData.append(item, self._data[item]);
                }
            }
        },
        addFileToFormData: function (formData) {
            if (self._files && self._formData) {
                for (var i = 0; i < self._files.length; i++) {
                    var file = self._files[i];
                    self._formData.append('file[' + i + ']', self._files[i]);
                }
            }
        }
	}
	window.Uploader = Uploader;
})(window);

(function(window){
	var self;
	var instance = null;
	var Status = {
        Ready: 0,
        Uploading: 1,
        Complete: 2
    }
	var Queue = function(){
		self = this;
		self._datas = [];
		self._size = 0;
	}

	Queue.prototype = {
		add: function(data){
			var key = new Date().getTime();
			self._datas.push({key:key, data:data, status:Status.Ready});
			self._size = self._datas.length;
			return key;
		},
		remove: function(key){
			var index = self._getIndexByKey(key);
			self._datas.splice(index, 1);
            self._size = self._datas.length;
		},
		get: function (key){
            var index = self._getIndexByKey(key);
            return index != -1 ? self._datas[index] : null;
        },
        clear: function(){
            self._datas = [];
            self._size = self._datas.length;
        },
        size: function(){
            return self._size;
        },
        setItemStatus: function(key, status){
            var index = self._getIndexByKey(key);
            if (index != -1) {
                self._datas[index].status = status;
            }
        },
        nextReadyingIndex: function(){
            for (var i = 0; i < self._datas.length; i++){
                if(self._datas[i].status == Status.Ready){
                    return i;
                }
            }
            return -1;
        },
        getDataByIndex: function(index){
            if (index < 0) {
                return null;
            }
            return self._datas[index];
        },
		_getIndexByKey: function(key){
            for (var i = 0; i < self._datas.length; i++){
                if (self._datas[i].key == key){
                    return i;
                }
            }
            return -1;
        }
	}

	function getInstance(){
        if (instance === null) {
            instance = new Queue();
            return instance;
        } else {
            return instance;
        }
    }

    window.UploaderQueue = getInstance();
})(window);