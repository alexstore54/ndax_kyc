

document.addEventListener('DOMContentLoaded', () => {
    const circle = document.getElementById('circle-animation');
    const start_record = document.getElementById('start-recording');
    const instruction = document.getElementById('instruction');
    const close_cam = document.getElementById('close-camera');
   
    const nextbtn = document.getElementById('next-button');
    const innerBtnSpanText = document.querySelector('#_start-btn-innerSpan');

    const camera_overlay = document.getElementById('camera-overlay');
    const videoBlock = document.getElementById('camera');

    const spinner = document.querySelector('.lds-ellipsis');
    const formContainer = document.querySelector('#home');
    const processing = document.querySelector('.verification-processing');
    const noCamera = document.getElementById('no-camera');

    let cameraAccessible = false;

    class Utils {
        async launchCamera() {
            try {

                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                


                videoBlock.srcObject = stream;
                cameraAccessible = true;
                start_record.disabled = false;
                camera_overlay.style.display = 'flex';
            } catch (error) {
                console.error('Error accessing camera: ', error.message);
                cameraAccessible = false;
                this.showNoCameraMessage();
                start_record.disabled = true;
            }
        }

        startRecordingTimer() {
            const video = videoBlock;
            const stream = video.srcObject;

            if (stream && stream.active) {
                const duration = 15 * 1000; // 15 seconds

                circle.classList.add('active');
                instruction.style.display = 'block';
                start_record.style.display = 'none';
                close_cam.style.display = 'none';

                setTimeout(() => {
                    this.stopCamera();
                    this.showVerificationMessage();
                    localStorage.setItem('complete_ndax_verif', true);
                }, duration);
            } else {
                cameraAccessible = false;
                this.showNoCameraMessage();
                alert('Camera access was revoked. Please ensure the camera is allowed.');
            }
        }

        stopCamera() {
            const video = videoBlock;
            const stream = video.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                video.srcObject = null;
            }

            circle.classList.remove('active');
            close_cam.style.display = 'block';
            camera_overlay.style.display = 'none';
        }

        showVerificationMessage() {
            processing.style.display = 'flex';
            formContainer.style.display = 'none';
        }

        showNoCameraMessage() {
            noCamera.style.display = 'block';
            camera_overlay.style.display = 'none';
            formContainer.style.display = 'none';
        }
        toggleSpinner() {
          
             spinner.classList.toggle('d-none');
             innerBtnSpanText.classList.toggle('d-none');
        }
    }

    const utils = new Utils();

    nextbtn.addEventListener('click', async () => {
        utils.toggleSpinner();
        if(!localStorage.getItem('complete_ndax_verif')){
            await utils.launchCamera();
        }else {
            utils.showVerificationMessage();
        }
        
        utils.toggleSpinner();
    });

    start_record.addEventListener('click', () => {
        if (cameraAccessible) {
            utils.startRecordingTimer();
        } else {
            alert('Camera is not accessible. Please ensure the camera is available and allowed.');
        }
    });

    close_cam.addEventListener('click', () => {
        utils.stopCamera();
    });

   
});


