window.onload = function () {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const sectionHeader = $(".header");
    const sectionCreate = $(".create");
    const documentContainerTop = $(".document-container-top");
    const documentMain = $(".document-main");
    const addBtn = $(".add-btn");
    const editLogo = $(".edit-logo");
    const editSection = $(".edit");
    const createItemBlank = $(".create-item-image");

    const sectionCreateHeight = sectionCreate.offsetHeight;
    const documentContainerTopHeight = documentContainerTop.offsetHeight;

    const app = (function () {
        return {
            handleEvents() {
                // window scroll
                const handleScroll = () => {
                    if (window.scrollY >= sectionCreateHeight) {
                        addBtn.classList.add("active");
                        documentContainerTop.classList.add("active");
                        documentMain.style = `margin-top: ${documentContainerTopHeight}px`;
                    } else {
                        addBtn.classList.remove("active");
                        documentContainerTop.classList.remove("active");
                        documentMain.style = `margin: 0`;
                    }
                };
                window.addEventListener("scroll", handleScroll);

                // handle open/close editSection
                const handleOpenEditSection = () => {
                    editSection.classList.add("active");
                    const body = document.body;
                    body.style.height = "100vh";
                    body.style.overflowY = "hidden";
                };
                const handleCloseEditSection = () => {
                    editSection.classList.remove("active");
                    const body = document.body;
                    body.style.height = "";
                    body.style.overflowY = "";
                };
                editLogo.onclick = () => {
                    handleCloseEditSection();
                };
                createItemBlank.onclick = () => {
                    handleOpenEditSection();
                };
                addBtn.onclick = () => {
                    handleOpenEditSection();
                };
            },
            init() {
                this.handleEvents();
            },
        };
    })();
    app.init();
};
