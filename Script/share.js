const viewBtn = document.querySelector(".share"),
popup = document.querySelector(".popup"),
close = popup.querySelector(".close"),
field = popup.querySelector(".field"),
input = field.querySelector("input"),
copy = field.querySelector("button");

var dataURL;

function generateAndSharePDF() {
    var element = document.getElementById("canJigsaw");
    // initiate the generated pdf settings
    var opt = {
      margin: 0,
      filename: 'sharing.pdf',
      html2canvas: { scale: 1, useCORS: true },
      jsPDF: { orientation:"landscape", unit: 'px', format: [850, 620], /*orientation: 'l' */}
    };
  
    html2pdf().set(opt).from(element).output("blob").then(function (blob) {
      var reader = new FileReader();
      reader.onloadend = function() {
        dataURL = reader.result;
        console.log(dataURL);
        var iframe = document.createElement("iframe");
        iframe.src = dataURL;
        iframe.style.width = "100%";
        iframe.style.height = "150%";
  
        var screenshotDiv = document.getElementById("capturePic");
        screenshotDiv.innerHTML = "";
        screenshotDiv.appendChild(iframe);

      };
  
      reader.readAsDataURL(blob);
    });
    
  }

// Function to share to Facebook
function shareToFacebook() {
const shareUrl = encodeURIComponent(dataURL);
window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank");
}

// Function to share to Twitter
function shareToTwitter() {
    const shareText = "Check out this awesome history puzzle on Ancester Echo";
    const shareUrl = encodeURIComponent(dataURL);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, "_blank");
    }

// Function to share to Pinterest
function shareToPinterest() {
const shareText = "Check out this awesome history puzzle on Ancester Echo";
const shareUrl = encodeURIComponent(dataURL);
window.open(`https://www.pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}`, "_blank");
}


// Function to download
function shareToDownload() {
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = "screenshot.pdf"; // 你可以自定义下载的文件名
    downloadLink.click();
}

// Add event listeners for each social button
const socialButtons = document.querySelectorAll(".icons a");
socialButtons.forEach(button => {
button.addEventListener("click", (e) => {
e.preventDefault();
const platform = button.id;

if (platform === "facebook") {
  shareToFacebook();
} else if (platform === "twitter") {
  shareToTwitter();
} else if (platform === "download") {
  shareToDownload();
  }

});
});

viewBtn.onclick = () => {
    generateAndSharePDF(); 
popup.classList.toggle("show");
}
close.onclick = () => {
viewBtn.click();
}

copy.onclick = () => {
input.select();
if (document.execCommand("copy")) {
field.classList.add("active");
copy.innerText = "Copied";
setTimeout(() => {
  window.getSelection().removeAllRanges();
  field.classList.remove("active");
  copy.innerText = "Copy";
}, 3000);
}
}

