tinymce.init({
    selector: ".edit-content",
    plugins:
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
    toolbar_mode: "floating",
    height: "550",

    init_instance_callback: function (editor) {
        editor.on("click", function (e) {
            document.querySelector(".edit-right").classList.remove("active");
        });
    },
});
