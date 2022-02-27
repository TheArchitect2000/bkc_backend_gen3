//mehdi salartayefeh
//image functions


function ssimg(obj) {
    var imgid = obj.getAttribute('id');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        obj.addEventListener('change', handleFileSelect, false);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

function handleFileSelect(evt) {
    srviconvalid = false;
    var f = evt.target.files[0]; // FileList object
    if(!f.type.startsWith('image')){
        let iconimg = document.getElementById('srviconpreview');
        iconimg.src = defaulticon;
        srviconbase64 = '';
        srviconmessage = 'Bad file type is selected, please select a true image file with extension .PNG or .JPG';
        swal({
            title: 'Service Icon',
            text: srviconmessage,
            html: true,
            timer: 3000,
            type: "warning",
            showConfirmButton: true
        });
        return;
    }
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            var binaryData = e.target.result;
            //Converting Binary Data to base 64
            var base64String = window.btoa(binaryData);
            //showing file converted to base64
            srviconbase64 = 'data:image/png;base64,' + base64String;
            let iconimg = document.getElementById('srviconpreview');
            $('#srviconpreview').removeClass('img-responsive')
            iconimg.src = srviconbase64;
            setTimeout(() => iconFileChanged(iconimg), 200);
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
}

function iconFileChanged(iconimg) {
    console.log('srviconbase64', iconimg.clientWidth, iconimg.clientHeight);

    $('#iconwidth').text(iconimg.clientWidth);
    $('#iconheight').text(iconimg.clientHeight);

    srviconvalid = true;
    srviconmessage = '';
    /*if(iconimg.clientWidth != iconimg.clientHeight) {
     srviconvalid = false;
     srviconmessage = 'Width and Height of icon must be equal'
     }*/
    if (iconimg.clientWidth > 512 || iconimg.clientHeight > 512) {
        srviconvalid = false;
        srviconmessage = 'Width and Height of icon must be <= 512 px'
    }

    $('#srviconpreview').addClass('img-responsive')

    if (!srviconvalid) {
        swal({
            title: 'Service Icon',
            text: srviconmessage,
            html: true,
            //                    timer: 2000,
            type: "warning",
            showConfirmButton: true
        });
    }
}

function compress(e) {
    const width = 500;
    const height = 300;
    const fileName = e.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const elem = document.createElement('canvas');
            elem.width = width;
            elem.height = height;
            const ctx = elem.getContext('2d');
            // img.width and img.height will contain the original dimensions
            ctx.drawImage(img, 0, 0, width, height);
            ctx.canvas.toBlob((blob) => {
                const file = new File([blob], fileName, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });
            }, 'image/jpeg', 1);
        },
            reader.onerror = error => console.log(error);
    };
}

(function ssImageLoad() {
    document.querySelectorAll('[ssimg]').forEach(ssimg);
})();