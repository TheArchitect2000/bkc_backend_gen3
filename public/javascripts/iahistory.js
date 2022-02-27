var IA_History = {
    devices: {},
    _addHistory: function(device, message){
        if(!this.devices[device]){
            this.devices[device] = [];
        }
        this.devices[device].push(message);
        this._commit();
    },
    _commit: function(){
        window.localStorage.setItem('iahistory', JSON.stringify(IA_History))
    },
    _clear: function (needConfirm) {
        if(!needConfirm){
            this.devices = [];
            this._commit();
            return;
        }
        swal.fire({title: "Attention", html:"Do you want to clear history of all activities?", icon:"warning",
            showCancelButton: true,
            confirmButtonText: 'Clear'
        }).then((result) => {
            if (result.value) {
                this.devices = [];
                this._commit();
                // show_sspage("../customer/views/history.device.view.html")
            }
        });
    }
};

if(window.localStorage.getItem('iahistory'))
    IA_History.devices= JSON.parse(window.localStorage.getItem('iahistory')).devices;

