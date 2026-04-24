const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");

chatBtn.onclick = () => {
chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
};

function reply(text) {
const div = document.createElement("div");
div.innerText = text;
chatBox.appendChild(div);
}
